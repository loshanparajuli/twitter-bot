import { NextResponse } from "next/server"
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || "@communeaidotorg OR #communeaidotorg" //You know, what this if for
 
  try {
    console.log("Fetching tweets for query:", query)
 
    if (!process.env.TWITTER_BEARER_TOKEN) {
      throw new Error("TWITTER_BEARER_TOKEN is not set")
    }
 
    const url = new URL("https://api.twitter.com/2/tweets/search/recent")
    url.searchParams.append("query", query)
    url.searchParams.append("tweet.fields", "created_at,public_metrics")
    url.searchParams.append("user.fields", "profile_image_url")
    url.searchParams.append("expansions", "author_id")
    url.searchParams.append("max_results", "10")
 
    console.log("Fetching from URL:", url.toString())
 
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
 
    if (!response.ok) {
      const errorBody = await response.text()
      console.error("Twitter API error:", response.status, errorBody)
      throw new Error(`Twitter API responded with status: ${response.status}, Body: ${errorBody}`)
    }
 
    const result = await response.json()
 
    console.log("API response:", JSON.stringify(result, null, 2))
 
    if (!result.data || result.data.length === 0) {
      console.log("No tweets found")
      return NextResponse.json({ tweets: [] })
    }
 
    const tweets = result.data.map((tweet: any) => {
      const user = result.includes.users?.find((user: any) => user.id === tweet.author_id)
      return {
        id: tweet.id,
        created_at: tweet.created_at,
        text: tweet.text,
        user: {
          name: user?.name || "",
          screen_name: user?.username || "",
          profile_image_url: user?.profile_image_url || "",
        },
        public_metrics: tweet.public_metrics || {
          reply_count: 0,
          retweet_count: 0,
          like_count: 0,
          quote_count: 0,
        },
      }
    })
 
    console.log("Processed tweets:", JSON.stringify(tweets, null, 2))
    return NextResponse.json({ tweets })
  } catch (error: any) {
    console.error("Error fetching tweets:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch tweets",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
