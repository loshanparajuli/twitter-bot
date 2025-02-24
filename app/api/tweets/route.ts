import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query") || "@communeaidotorg OR #communeaidotorg"
  
  try {
    if (!process.env.TWITTER_BEARER_TOKEN) throw new Error("TWITTER_BEARER_TOKEN is not set")

    const url = new URL("https://api.twitter.com/2/tweets/search/recent")
    url.searchParams.set("query", query)
    url.searchParams.set("tweet.fields", "created_at,public_metrics")
    url.searchParams.set("user.fields", "profile_image_url")
    url.searchParams.set("expansions", "author_id")
    url.searchParams.set("max_results", "10")

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
    })

    if (!response.ok) throw new Error(`Twitter API error: ${response.status}`)

    const result = await response.json()
    if (!result.data) return NextResponse.json({ tweets: [] })

    const tweets = result.data.map((tweet: any) => ({
      id: tweet.id,
      created_at: tweet.created_at,
      text: tweet.text,
      user: result.includes.users?.find((u: any) => u.id === tweet.author_id) || {},
      public_metrics: tweet.public_metrics || {},
    }))

    return NextResponse.json({ tweets })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch tweets", message: error.message }, { status: 500 })
  }
}
