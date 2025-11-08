"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  Heart,
  MessageCircle,
  Send,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Clock,
  ExternalLink,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"

interface CommunityPost {
  id: string
  user_id: string
  content: string
  post_type: string
  likes_count: number
  comments_count: number
  created_at: string
  user_name?: string
  user_liked?: boolean
}

interface CalendarEvent {
  id: string
  event_type: string
  title: string
  description: string
  start_time: string
  end_time: string
  day_of_week: number | null
  specific_date: string | null
  butter_link: string | null
  is_non_negotiable: boolean
}

interface ActivityCompletion {
  id: string
  activity_type: string
  completion_date: string
  duration_minutes: number | null
}

interface ActivityStreak {
  activity_type: string
  current_streak: number
  longest_streak: number
}

export function WorkLifeBalanceCommunity() {
  const [activeView, setActiveView] = useState<"day" | "week" | "month" | "quarter">("day")
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [newPost, setNewPost] = useState("")
  const [postType, setPostType] = useState<"update" | "win" | "question">("update")
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [completions, setCompletions] = useState<ActivityCompletion[]>([])
  const [streaks, setStreaks] = useState<ActivityStreak[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        await loadCommunityData(user.id)
      }
    }
    initializeUser()
  }, [])

  const loadCommunityData = async (uid: string) => {
    // Load community posts
    const { data: postsData } = await supabase
      .from("community_posts")
      .select("*, user_profiles(name)")
      .order("created_at", { ascending: false })
      .limit(20)

    if (postsData) {
      setPosts(
        postsData.map((post: any) => ({
          ...post,
          user_name: post.user_profiles?.name || "Member",
        })),
      )
    }

    // Load calendar events
    const { data: eventsData } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("is_active", true)
      .order("start_time")

    if (eventsData) {
      setCalendarEvents(eventsData)
    }

    // Load today's completions
    const today = new Date().toISOString().split("T")[0]
    const { data: completionsData } = await supabase
      .from("activity_completions")
      .select("*")
      .eq("user_id", uid)
      .eq("completion_date", today)

    if (completionsData) {
      setCompletions(completionsData)
    }

    // Load streaks
    const { data: streaksData } = await supabase.from("activity_streaks").select("*").eq("user_id", uid)

    if (streaksData) {
      setStreaks(streaksData)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !userId) return

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: userId,
        content: newPost,
        post_type: postType,
      })
      .select()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
      return
    }

    setNewPost("")
    await loadCommunityData(userId)
    toast({
      title: "Success!",
      description: "Your post has been shared with the community",
    })
  }

  const handleCompleteActivity = async (eventId: string, activityType: string) => {
    if (!userId) return

    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase.from("activity_completions").insert({
      user_id: userId,
      event_id: eventId,
      activity_type: activityType,
      completion_date: today,
    })

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already completed",
          description: "You've already checked this activity today!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to mark activity complete",
          variant: "destructive",
        })
      }
      return
    }

    await loadCommunityData(userId)
    toast({
      title: "Great job!",
      description: "Activity marked complete. Keep your streak going!",
    })
  }

  const getTodayEvents = () => {
    const today = new Date().getDay()
    return calendarEvents.filter((event) => event.day_of_week === today)
  }

  const isActivityCompleted = (eventId: string) => {
    return completions.some((c) => c.id === eventId)
  }

  const getStreakForActivity = (activityType: string) => {
    return streaks.find((s) => s.activity_type === activityType)
  }

  const renderDayView = () => {
    const todayEvents = getTodayEvents()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date()

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {dayNames[today.getDay()]}, {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h3>
          <p className="text-gray-600">Your 4-Day Work Week Schedule</p>
        </div>

        <div className="space-y-3">
          {todayEvents.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">
                  {today.getDay() === 0
                    ? "Today is Sunday! Join The Sunday Shift at 1:00 PM ET to set your weekly intention."
                    : today.getDay() >= 5
                      ? "Enjoy your Time Freedom day! The hub reopens Monday."
                      : "No scheduled activities today. Enjoy your break!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            todayEvents.map((event) => {
              const completed = isActivityCompleted(event.id)
              const streak = getStreakForActivity(event.event_type)

              return (
                <Card
                  key={event.id}
                  className={`border-2 ${completed ? "border-[#7FB069] bg-[#7FB069]/5" : "border-gray-200"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{event.title}</h4>
                          {event.is_non_negotiable && (
                            <Badge variant="secondary" className="bg-[#E26C73] text-white text-xs">
                              Non-Negotiable
                            </Badge>
                          )}
                          {completed && <CheckCircle className="w-5 h-5 text-[#7FB069]" />}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.start_time} - {event.end_time}
                            </span>
                          </div>

                          {streak && (
                            <div className="flex items-center gap-1 text-[#7FB069]">
                              <Award className="w-4 h-4" />
                              <span className="font-semibold">{streak.current_streak} day streak!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {event.butter_link && (
                          <a href={event.butter_link} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          </a>
                        )}

                        {!completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteActivity(event.id, event.event_type)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
          Work-Life Balance Community
        </h2>
        <p className="text-lg text-gray-600">Connect, share, and grow together on your journey</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side - Community Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#7FB069]">Share with the Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={postType === "update" ? "default" : "outline"}
                  onClick={() => setPostType("update")}
                  className={postType === "update" ? "bg-[#7FB069]" : ""}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant={postType === "win" ? "default" : "outline"}
                  onClick={() => setPostType("win")}
                  className={postType === "win" ? "bg-[#E26C73]" : ""}
                >
                  Win
                </Button>
                <Button
                  size="sm"
                  variant={postType === "question" ? "default" : "outline"}
                  onClick={() => setPostType("question")}
                >
                  Question
                </Button>
              </div>

              <Textarea
                placeholder="Share your progress, wins, or questions..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />

              <Button onClick={handleCreatePost} className="w-full bg-[#7FB069] hover:bg-[#6FA055]">
                <Send className="w-4 h-4 mr-2" />
                Share with Community
              </Button>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="border-2 border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center text-white font-bold">
                      {post.user_name?.[0] || "M"}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{post.user_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.post_type}
                        </Badge>
                        <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>

                      <p className="text-gray-700 mb-3">{post.content}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <button className="flex items-center gap-1 hover:text-[#E26C73]">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes_count}</span>
                        </button>

                        <button className="flex items-center gap-1 hover:text-[#7FB069]">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Calendar & Streaks */}
        <div className="space-y-6">
          {/* Calendar Views Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#E26C73] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Your Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                </TabsList>

                <TabsContent value="day">{renderDayView()}</TabsContent>

                <TabsContent value="week">
                  <div className="text-center p-8 text-gray-600">Week view coming soon</div>
                </TabsContent>

                <TabsContent value="month">
                  <div className="text-center p-8 text-gray-600">Month view coming soon</div>
                </TabsContent>

                <TabsContent value="quarter">
                  <div className="text-center p-8 text-gray-600">Quarter view coming soon</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Streaks Card */}
          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069] flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streaks.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">Complete activities to start building streaks!</p>
              ) : (
                <div className="space-y-3">
                  {streaks.map((streak) => (
                    <div
                      key={streak.activity_type}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {streak.activity_type.replace("-", " ")}
                        </p>
                        <p className="text-xs text-gray-600">Best: {streak.longest_streak} days</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#7FB069]">{streak.current_streak}</div>
                        <p className="text-xs text-gray-600">day streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader>
              <CardTitle className="text-[#E26C73] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-bold text-gray-900">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts Today</span>
                  <span className="font-bold text-gray-900">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Completions</span>
                  <span className="font-bold text-gray-900">1,243</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
