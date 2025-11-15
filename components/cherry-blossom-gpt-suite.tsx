"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const CherryBlossomGPTSuite = () => {
  const specialists = [
    {
      id: "morning-routine",
      name: "Morning Routine Specialist",
      icon: "/images/tea-cup-icon.png",
      description: "Start your day with intention and energy",
      buttonText: "Join The Morning Routine\n9 - 10:30 AM ET",
      timeSlot: "9 - 10:30 AM ET",
    },
    {
      id: "workout-window",
      name: "Workout Window Specialist",
      icon: "/images/yoga-meditation-icon.png",
      description: "Find your perfect fitness routine",
      buttonText: "Join The Workout Window\n10:30 AM - 11:00 AM ET",
      timeSlot: "10:30 AM - 11:00 AM ET",
    },
    {
      id: "lunch-break",
      name: "Lunch Break Specialist",
      icon: "/images/laptop-presentation-icon.png",
      description: "Maximize your midday break",
      buttonText: "Join The Lunch Break\n11:00 AM - 12:00 PM ET",
      timeSlot: "11:00 AM - 12:00 PM ET",
    },
    {
      id: "ceo-workday",
      name: "CEO Workday Specialist",
      icon: "/images/ceo-presentation-cherry-blossom-icon.png",
      description: "Lead with purpose and clarity",
      buttonText: "Join The CEO Workday\n2:00 PM - 3:00 PM ET",
      timeSlot: "2:00 PM - 3:00 PM ET",
    },
    {
      id: "lifestyle-experiences",
      name: "Lifestyle Experiences Specialist",
      icon: "/images/family-vacation-icon.png",
      description: "Create meaningful life experiences",
      buttonText: "Join Lifestyle Experiences\n5 - 7 PM ET",
      timeSlot: "5 - 7 PM ET",
    },
    {
      id: "digital-detox",
      name: "Digital Detox Specialist",
      icon: "/images/power-down-moon-cherry-blossom-icon.png",
      description: "Unwind and disconnect mindfully",
      buttonText: "Join The Digital Detox\n9:00 PM - 10:00 PM ET",
      timeSlot: "9:00 PM - 10:00 PM ET",
    },
    {
      id: "morning-ritual",
      name: "Morning Ritual Specialist",
      icon: "/images/morning-ritual-icon.png",
      description: "Establish a morning ritual for productivity",
      buttonText: "Join The Morning Ritual\n6:00 AM - 7:00 AM ET",
      timeSlot: "6:00 AM - 7:00 AM ET",
    },
    {
      id: "presentation-mastery",
      name: "Presentation Mastery Specialist",
      icon: "/images/presentation-mastery-icon.png",
      description: "Master the art of presentations",
      buttonText: "Join Presentation Mastery\n12 - 1:30 PM ET",
      timeSlot: "12 - 1:30 PM ET",
    },
    {
      id: "spiritual-guidance",
      name: "Spiritual Guidance Specialist",
      icon: "/images/spiritual-guidance-icon.png",
      description: "Seek spiritual guidance and growth",
      buttonText: "Join Spiritual Guidance\n7 - 8 PM ET",
      timeSlot: "7 - 8 PM ET",
    },
    {
      id: "vacation-recovery",
      name: "Vacation Recovery Specialist",
      icon: "/images/vacation-recovery-icon.png",
      description: "Recover and rejuvenate from vacations",
      buttonText: "Join Vacation Recovery\nFlexible - As Needed",
      timeSlot: "Flexible - As Needed",
    },
  ]

  const handleSpecialistClick = (specialist: any) => {
    console.log(`Clicked on ${specialist.name}`)
    // Implement specialist click logic here
  }

  return (
    <div className="cherry-blossom-gpt-suite">
      {specialists.map((specialist) => (
        <div key={specialist.id} className="specialist-card">
          <div className="card-header">
            <img src={specialist.icon || "/placeholder.svg"} alt={specialist.name} className="specialist-icon" />
            <Badge>{specialist.timeSlot}</Badge>
          </div>
          <h2 className="specialist-name">{specialist.name}</h2>
          <p className="specialist-description">{specialist.description}</p>
          <Button
            onClick={() => handleSpecialistClick(specialist)}
            className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 whitespace-pre-line"
          >
            {specialist.buttonText}
          </Button>
        </div>
      ))}
    </div>
  )
}

export default CherryBlossomGPTSuite
