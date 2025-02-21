import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface TweetProps {
  tweet: {
    id: string
    created_at: string
    text: string
    user: {
      name: string
      screen_name: string
      profile_image_url: string
    }
    public_metrics: {
      reply_count: number
      retweet_count: number
      like_count: number
      quote_count: number
    }
  }
}

export default function Tweet({ tweet }: TweetProps) {
  const createdAt = new Date(tweet.created_at)

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <Image
          src={tweet.user.profile_image_url || "/placeholder.svg"}
          alt={tweet.user.name}
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold">{tweet.user.name}</h2>
          <p className="text-sm text-gray-400">@{tweet.user.screen_name}</p>
        </div>
        <p className="text-sm text-gray-400 ml-auto">{formatDistanceToNow(createdAt, { addSuffix: true })}</p>
      </div>
      <p className="mb-3">{tweet.text}</p>
      <div className="flex justify-between text-sm text-gray-400">
        <span>💬 {tweet.public_metrics.reply_count}</span>
        <span>🔁 {tweet.public_metrics.retweet_count}</span>
        <span>❤️ {tweet.public_metrics.like_count}</span>
        <span>🗨️ {tweet.public_metrics.quote_count}</span>
      </div>
    </div>
  )
}

