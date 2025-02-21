import TweetList from "@/components/TweetList"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Commune AI Tweets</h1>
        <TweetList query="@communeaidotorg OR #communeaidotorg" />
      </div>
    </main>
  )
}

