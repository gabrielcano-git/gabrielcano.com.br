import os
import re
import urllib.request
import json
from datetime import datetime, timezone
from typing import List, Optional

# --- Global Configuration ---
THREADS_BASE = "https://graph.threads.net/v1.0"
FIELDS = "id,text,timestamp,permalink,is_quote_post"
API_FETCH_LIMIT = 10 


def relative_time_pt(iso_timestamp: str) -> str:
    """
    Convert an ISO 8601 timestamp to a relative time string in Portuguese.

    This function receives a string containing an ISO 8601 timestamp and returns
    a string representing the relative time in Portuguese (e.g., "2 horas atrás", "agora").

    Args:
        iso_timestamp (str): The ISO 8601 timestamp.

    Returns:
        str: The relative time string in Portuguese. Returns an empty string on error.
    """
    try:
        s = re.sub(r"\+00:?00$", "Z", iso_timestamp.strip())
        if not s.endswith("Z"):
            if re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", s):
                s = s + "Z"
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        delta = now - dt
        sec = int(delta.total_seconds())

        if sec < 60:
            return "agora"
        if sec < 3600:
            m = sec // 60
            return f"{m} min atrás" if m > 1 else "1 min atrás"
        if sec < 86400:
            h = sec // 3600
            return f"{h} horas atrás" if h > 1 else "1 hora atrás"
        if sec < 604800:
            d = sec // 86400
            return f"{d} dias atrás" if d > 1 else "1 dia atrás"
        return dt.strftime("%d %b").lower()
    except Exception:
        return ""


def fetch_threads(
    access_token: str,
    user_id: str,
    username: Optional[str] = None,
    limit: int = 3
) -> List[dict]:
    """
    Fetch posts from Threads API.

    Connects to the Threads API and retrieves the latest posts for a user.

    Args:
        access_token (str): The OAuth access token for authentication.
        user_id (str): The Threads user ID.
        username (Optional[str]): The username for thread URL construction (optional).
        limit (int, optional): The maximum number of posts to fetch (default 3, max 25).

    Returns:
        List[dict]: A list of dictionaries containing post data with keys: text, time, and link.

    Raises:
        Exception: If the API request fails or the response is not valid.
    """
    limit = max(1, min(limit, 25))
    fetch_limit = API_FETCH_LIMIT

    if username:
        url = (
            f"{THREADS_BASE}/{user_id}/threads?fields={FIELDS}&limit={fetch_limit}&access_token={access_token}"
        )
    else:
        url = (
            f"{THREADS_BASE}/me/threads?fields={FIELDS}&limit={fetch_limit}&access_token={access_token}"
        )

    req = urllib.request.Request(url, method="GET")
    req.add_header("Accept", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            items = data.get("data") or []
            non_quote = [i for i in items if i.get("is_quote_post") is False]
            result = []
            for i in non_quote[:limit]:
                result.append(
                    {
                        "text": (i.get("text") or "").strip(),
                        "time": relative_time_pt(i.get("timestamp", "")),
                        "link": i.get("permalink", ""),
                    }
                )
            return result
    except Exception as e:
        print(f"Erro na API: {e}")
        raise


def lambda_handler(event, context):
    """
    AWS Lambda entry point for handling API Gateway requests.

    This function serves as the main handler for the Lambda function when
    integrated with API Gateway. It processes GET and OPTIONS requests,
    manages CORS headers, and returns the latest Threads posts in JSON format.

    Args:
        event (dict): The AWS Lambda event payload.
        context (LambdaContext): The AWS Lambda context object.

    Returns:
        dict: A response compatible with AWS Lambda proxy integration,
              including statusCode, headers, and body.
    """
    origin = os.environ.get("CORS_ORIGIN", "*").strip()
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    # Handle preflight (OPTIONS) CORS requests
    if (
        event.get("httpMethod") == "OPTIONS"
        or event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS"
    ):
        return {"statusCode": 204, "headers": headers, "body": ""}

    token = os.environ.get("THREADS_ACCESS_TOKEN", "").strip()
    user_id = os.environ.get("THREADS_USER_ID", "").strip() or None
    username = os.environ.get("THREADS_USERNAME", "").strip() or None

    try:
        limit_env = os.environ.get("THREADS_LIMIT", "3")
        limit = int(limit_env) if limit_env.isdigit() else 3
    except ValueError:
        limit = 3

    if not token:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps(
                {"error": "Missing configuration: THREADS_ACCESS_TOKEN"}
            ),
        }

    if not user_id:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps(
                {"error": "Missing configuration: THREADS_USER_ID"}
            ),
        }

    try:
        posts = fetch_threads(token, user_id, username, limit)
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(posts, ensure_ascii=False),
        }
    except Exception as e:
        return {
            "statusCode": 502,
            "headers": headers,
            "body": json.dumps({"error": str(e)}, ensure_ascii=False),
        }