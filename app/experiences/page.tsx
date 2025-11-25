"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight, Sparkles, Clock, TrendingUp } from 'lucide-react'
import Link from "next/link"

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Editorial Style */}
      <div
        className="relative min-h-[85vh] flex items-center justify-center px-6 py-20"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 text-sm px-6 py-2 font-medium">
            2026 Enrollment Now Open
          </Badge>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
            Make Time
            <br />
            For More
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            The Work-Life Balance Business Model that gives high-achieving entrepreneurs their time back—without
            sacrificing success.
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              4-Day Workweek • 4-Hour Workday • 152 Hours of Weekly Freedom
            </p>
          </div>
        </div>
      </div>

      {/* The Promise - Clean Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground leading-tight">
            You didn't leave your high-stress role to recreate burnout in your business.
          </h2>

          <div className="prose prose-lg max-w-none text-center">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              You left for work-life balance, time-freedom, and success on your terms.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              But somewhere along the way, those unhealthy hustle habits crept in—60-80 hour weeks, always "on," never
              unplugging. Freedom vanished.
            </p>
            <p className="text-2xl font-semibold text-foreground mt-12">Until now.</p>
          </div>
        </div>
      </div>

      {/* The Transformation - Sage Background */}
      <div className="py-24 px-6" style={{ backgroundColor: "#E8F3E8" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              The Work-Life Balance Business Model
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven system that harmonizes spiritual alignment, scientific habit-building, and AI automation for
              sustainable success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Spiritual</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-center">
                  Set your 28-Day Desired Work-Lifestyle Intention using the GIVEN Framework. Plant your spiritual seed
                  and align with what's already available in the energetic realm.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Scientific</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-center">
                  Rewire your nervous system through neuroscience-backed rituals. Replace 6 hustle habits with practices
                  that regulate hormones, retrain your brain, and sustain energy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                    <Clock className="w-8 h-8 text-secondary" />
                 
