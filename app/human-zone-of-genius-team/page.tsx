"use client"



import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Sparkles, Brain, ArrowLeft, Target, TrendingUp, Calendar, 
  Clock, Zap, Heart, MessageCircle, Lightbulb, Users, Award, Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal";
import { CoPilotChatModal } from "@/components/co-pilot-chat-modal";
import { ExecutiveChatModal } from "@/components/executive-chat-modal";

const executives = [
  { id: "optima-sage", name: "Optima Sage", role: "COO", icon: "🎯", description: "Streamlines operations and optimizes processes for maximum efficiency." },
  { id: "ledger-maven", name: "Ledger Maven", role: "CFO", icon: "💰", description: "Manages financial strategy, profitability, and pricing." },
  { id: "brand-beacon", name: "Brand Beacon", role: "CMO", icon: "📢", description: "Crafts marketing strategies to attract ideal clients." },
  { id: "deal-catalyst", name: "Deal Catalyst", role: "Sales Director", icon: "🤝", description: "Develops sales strategies and conversion systems." },
  { id: "success-harmony", name: "Success Harmony", role: "Customer Success Manager", icon: "⭐", description: "Ensures exceptional client experiences and retention." },
  { id: "flow-architect", name: "Flow Architect", role: "Operations Manager", icon: "⚙️", description: "Handles day-to-day operations and workflows." },
  { id: "voice-amplifier", name: "Voice Amplifier", role: "PR Executive", icon: "📻", description: "Manages brand reputation and media relations." },
  { id: "stage-presence", name: "Stage Presence", role: "Speaking Coach", icon: "🎤", description: "Helps secure speaking engagements and opportunities." },
  { id: "event-orchestrator", name: "Event Orchestrator", role: "Virtual Events Director", icon: "🎪", description: "Plans engaging webinars and virtual events." },
  { id: "audio-storyteller", name: "Audio Storyteller", role: "Podcast Producer", icon: "🎙️", description: "Guides through all aspects of podcasting." },
  { id: "page-turner", name: "Page Turner", role: "Publishing Coach", icon: "📚", description: "Guides through book writing and publishing." },
  { id: "alliance-builder", name: "Alliance Builder", role: "Partnership Executive", icon: "🔗", description: "Creates strategic partnerships and collaborations." },
  { id: "visual-narrator", name: "Visual Narrator", role: "Video Content Creator", icon: "🎬", description: "Creates compelling marketing videos." },
  { id: "social-pulse", name: "Social Pulse", role: "Social Media Executive", icon: "📱", description: "Develops social media strategies and content." },
  { id: "design-artisan", name: "Design Artisan", role: "Graphic Designer", icon: "🎨", description: "Creates professional visual branding and design assets." },
];

const workdayPillars = [
  { icon: Clock, title: "1:00-5:00 PM Focus", description: "Mon-Thu focused workday for maximum leverage" },
  { icon: Target, title: "80/20 Pareto Principle", description: "20% of work that generates 80% of results" },
  { icon: Brain, title: "Human-Only Skills", description: "8 high-value skills only you can do" },
  { icon: Zap, title: "AI Delegation", description: "AI handles 80% of administrative tasks" }
];

const humanSkills = [
  { icon: Heart, title: "Authentic Client Relationships", description: "Deep empathy, emotional intelligence, and genuine human connection that builds trust and long-term client relationships AI cannot replicate." },
  { icon: Lightbulb, title: "Visionary Leadership", description: "Setting strategic direction, defining your unique methodology, and making high-level business decisions that shape your company's future." },
  { icon: MessageCircle, title: "High-Value Sales Conversations", description: "Discovery calls, enrollment conversations, and relationship-based selling where your intuition and human presence close premium clients." },
  { icon: Users, title: "Content Thought Leadership", description: "Your unique voice, perspective, and insights that position you as the authority. AI drafts, but your authentic experience makes it powerful." },
  { icon: Award, title: "Coaching/Consulting Delivery", description: "Facilitating transformation, asking powerful questions, holding space, and guiding clients through breakthroughs only you can deliver." },
  { icon: Brain, title: "Intuitive Problem-Solving", description: "Reading between the lines, sensing what's not being said, and innovating custom solutions based on pattern recognition and experience." },
  { icon: Shield, title: "Ethical Decision-Making", description: "Values-based leadership, cultural sensitivity, and navigating complex ethical situations that require human judgment and integrity." },
  { icon: Sparkles, title: "Personal Brand Storytelling", description: "Sharing your journey, vulnerabilities, and transformation story that creates emotional resonance and attracts ideal clients to you." },
];

export default function HumanZoneOfGeniusTeam() {
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const [isAssessmentChatOpen, setIsAssessmentChatOpen] = useState(false);
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<typeof executives[0] | null>(null);

  const assessmentPrefillMessage = "I want to design my personalized 4-Hour Focused CEO Workday (1:00-5:00 PM). Can you guide me through a comprehensive assessment to create my customized coaching/consulting business journey based on my zone of genius, entrepreneurial status, and work-life goals?";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Human Zone Of Genius Team
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
            Your dedicated command center above the AI Executive Team
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            In the AI Age, this is where you identify the 20% of high-value work that only YOU can do—the work that generates 80% of your results.
          </p>

          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => setIsAssessmentChatOpen(true)}
            data-testid="button-start-assessment"
          >
            <Brain className="w-5 h-5 mr-2" />
            Start Your Zone of Genius Assessment
          </Button>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-primary via-accent to-primary">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Co-Pilot Master Coach
              </CardTitle>
              <CardDescription className="text-xl text-foreground font-medium">
                Your Strategic AI Orchestrator with Complete Team Memory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground text-center max-w-3xl mx-auto">
                The Co-Pilot has complete access to all your conversations across all 25 AI executives. 
                It synthesizes insights, identifies patterns, connects the dots across business areas, 
                and provides strategic guidance based on everything you've discussed with your entire AI team.
              </p>
              
              <div className="bg-accent/10 rounded-lg p-6 border-2 border-primary/20">
                <p className="text-lg mb-2">
                  <strong className="text-primary">✨ Pro Tip:</strong> Ask Co-Pilot to:
                </p>
                <ul className="text-lg text-muted-foreground space-y-2 ml-6 list-disc">
                  <li>Summarize your progress across all executives</li>
                  <li>Identify your top 3 priorities this week</li>
                  <li>Connect insights from different business areas</li>
                  <li>Spot gaps in your business strategy</li>
                </ul>
              </div>

              <div className="text-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsCoPilotOpen(true)}
                  className="text-xl px-12 py-6 shadow-lg"
                  data-testid="button-launch-copilot"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Launch Co-Pilot Command Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">4 Workday Pillars</h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            The foundation of your 4-Hour Focused CEO Workday
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workdayPillars.map((pillar, index) => (
              <Card key={index} className="border-2 border-primary/20">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                    <pillar.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Your AI Team Serves You Daily
          </h2>
          
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Monday through Thursday, 1:00-5:00 PM EST, your AI Executive Team guides you through the exact next-best-move for forward momentum in your coaching or consulting business using the 80/20 Pareto Principle.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <Target className="w-12 h-12 mb-4 text-primary" />
                <CardTitle className="text-2xl">Next Best Move</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Each business day, the AI tells you exactly what needle-moving action to focus on for maximum leverage and forward momentum.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mb-4 text-primary" />
                <CardTitle className="text-2xl">Progress Education</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  The AI team educates you daily on what's happening in your business, showing your accomplishments and guiding you to 6, 7, 8 figure+ revenue.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <Calendar className="w-12 h-12 mb-4 text-primary" />
                <CardTitle className="text-2xl">Mon-Thu 1-5pm EST</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Your structured 4-hour workday focused entirely on the 20% of work that generates 80% of your results while AI handles the rest.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Your 8 Human-Only Business Skills
          </h2>
          
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            These are the specific skills you'll develop and focus on daily. These are what only YOU can do—the high-value work that builds 6, 7, 8 figure+ coaching and consulting businesses. The AI team handles everything else.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {humanSkills.map((skill, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <skill.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-xl">{index + 1}. {skill.title}</CardTitle>
                      <CardDescription className="text-lg leading-relaxed mt-2">
                        {skill.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/30">
              <CardContent className="p-8">
                <p className="text-xl font-semibold mb-2">While You Focus on These 8 Skills...</p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Your AI Executive Team handles: administrative tasks, content drafting, research, scheduling, email management, bookkeeping, transcription, proposals, social media posting, and all operational execution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Personalized Business Journey
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Through a comprehensive 13-step assessment, you'll discover your entrepreneurial status, passions, skills, zone of genius, and create a customized 3-phase roadmap (Foundation → Momentum → Mastery) for building your coaching or consulting business. Your AI team will then guide you daily on your next-best-move.
          </p>

          <Card className="text-left bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Your Assessment Creates Your Daily Roadmap:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg leading-relaxed">
              <div className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span>Your 2-3 core human-only skills from the 8 categories to develop daily</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span>What to STOP doing (delegate to AI/team) vs. START doing (your CEO-level work)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span>Daily next-best-move guidance (Mon-Thu 1-5pm) for needle-moving 80/20 actions</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span>AI education on your business progress, accomplishments, and path to 6-7-8 figures</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span>Phase-specific 4-Hour CEO Workday structure (Foundation, Momentum, or Mastery)</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setIsAssessmentChatOpen(true)}
              data-testid="button-start-assessment-bottom"
            >
              <Brain className="w-5 h-5 mr-2" />
              Begin Your Assessment
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Command Center Above the AI Team
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            The AI Executive Team serves YOU. They guide you through starting, growing, and scaling your coaching or consulting business. They keep you in your Zone of Genius, handling operational tasks unless you choose to take on a specific role. Daily, they educate you on business progress and tell you the exact next-best-move for forward momentum toward 6, 7, 8 figure+ revenue.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="border-primary/30 border-2">
              <CardHeader>
                <CardTitle className="text-xl">You (Human CEO) - The 20%</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Your 8 Human-Only Business Skills: authentic relationships, visionary leadership, high-value sales, thought leadership, coaching delivery, intuitive problem-solving, ethical decisions, and personal storytelling. This is where you create 80% of results.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-accent/30 border-2">
              <CardHeader>
                <CardTitle className="text-xl">AI Executive Team - The 80%</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  They serve you by handling: administrative tasks, content drafts, research, scheduling, inquiries, bookkeeping, transcription, proposals, social media, and operational execution. They educate you on daily business progress and guide your next moves.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Your 16 AI Executive Team
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Specialized AI executives ready to guide you through every aspect of your business
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {executives.map((exec) => (
              <Card 
                key={exec.id} 
                className="border-2 border-muted hover:border-primary transition-all cursor-pointer hover-elevate"
                onClick={() => setSelectedExecutive(exec)}
                data-testid={`card-executive-${exec.id}`}
              >
                <CardHeader>
                  <div className="text-5xl mb-3 text-center">{exec.icon}</div>
                  <CardTitle className="text-lg text-center">{exec.name}</CardTitle>
                  <CardDescription className="text-base font-semibold text-primary text-center">
                    {exec.role}
                  </CardDescription>
                  <CardDescription className="text-base leading-relaxed text-center pt-2">
                    {exec.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    data-testid={`button-chat-${exec.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Coaching
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CherryBlossomChatModal
        isOpen={isAssessmentChatOpen}
        onClose={() => setIsAssessmentChatOpen(false)}
        prefillMessage={assessmentPrefillMessage}
        conversationTitle="Human Zone of Genius Assessment"
        executiveRole="Cherry Blossom - CEO Workday"
        isAuthenticated={isAuthenticated}
        isLoadingAuth={isLoadingAuth}
      />

      <CoPilotChatModal
        isOpen={isCoPilotOpen}
        onClose={() => setIsCoPilotOpen(false)}
        isAuthenticated={isAuthenticated}
        isLoadingAuth={isLoadingAuth}
      />

      {selectedExecutive && (
  <ExecutiveChatModal
    isOpen={!!selectedExecutive}
    onClose={() => setSelectedExecutive(null)}
    executiveId={selectedExecutive.id}
    executiveName={selectedExecutive.name}
    executiveRole={selectedExecutive.role}
    executiveIcon={selectedExecutive.icon}
    isAuthenticated={isAuthenticated}
    isLoadingAuth={isLoadingAuth}
  />
)}
    </div>
  );
}
