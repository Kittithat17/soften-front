"use client"

import { HeroHeader2 } from "@/components/hero8-head2"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function BadgesPage() {
  const badges = [
    {
      id: 1,
      name: "1st Recipe Posted",
      image: "/images/Cookpedia_16_Badges/01_Recipe Seed_1st_Recipe_Posted.png",
      description: "Posted your first recipe",
      earned: true
    },
    {
      id: 2,
      name: "Kitchen Apprentice",
      image: "/images/Cookpedia_16_Badges/02_Kitchen_Apprentice_for_5_Recipes_Posted.png",
      description: "Created 5 recipes",
      earned: true
    },
    {
      id: 3,
      name: "Home Cook Hero",
      image: "/images/Cookpedia_16_Badges/03_HomeCookHero-10-Recipes-Posted.png",
      description: "Created 10 recipes",
      earned: true
    },
    {
      id: 4,
      name: "Chef's Disciple",
      image: "/images/Cookpedia_16_Badges/04_Chef's Disciple (25 Recipes Post).png",
      description: "Created 25 recipes",
      earned: false
    },
    {
      id: 5,
      name: "Master Chef",
      image: "/images/Cookpedia_16_Badges/05_Master_Chef_50RecipesPost.png",
      description: "Created 50 recipes",
      earned: false
    },
    {
      id: 6,
      name: "Cookpedia Legend",
      image: "/images/Cookpedia_16_Badges/06_CookpediaLegend_100up_RecipesPost.png",
      description: "Created 100+ recipes",
      earned: false
    },
    {
      id: 7,
      name: "Recipe Virtuoso",
      image: "/images/Cookpedia_16_Badges/L10_Recipe_Virtuoso.png",
      description: "Master of recipe creation",
      earned: false
    },
    {
      id: 8,
      name: "Culinary Innovator",
      image: "/images/Cookpedia_16_Badges/L20_Culinary_Innovator.png",
      description: "Created innovative recipes",
      earned: false
    },
    {
      id: 9,
      name: "Gourmet Guide",
      image: "/images/Cookpedia_16_Badges/L30_Gourmet_Guide.png",
      description: "Guided others in cooking",
      earned: false
    },
    {
      id: 10,
      name: "Flavor Architect",
      image: "/images/Cookpedia_16_Badges/L40_Flavor Architect.png",
      description: "Master of flavor combinations",
      earned: false
    },
    {
      id: 11,
      name: "Grand Epicurean",
      image: "/images/Cookpedia_16_Badges/L50_Grand Epicurean.png",
      description: "Achieved culinary excellence",
      earned: false
    },
    {
      id: 12,
      name: "Epicurean Guide",
      image: "/images/Cookpedia_16_Badges/L60_Epicurean Guide.png",
      description: "Guide to fine dining",
      earned: false
    },
    {
      id: 13,
      name: "Culinary Sovereign",
      image: "/images/Cookpedia_16_Badges/L70_Culinary Sovereign.png",
      description: "Sovereign of the kitchen",
      earned: false
    },
    {
      id: 14,
      name: "Platinum Palate",
      image: "/images/Cookpedia_16_Badges/L80_Platinum Palate.png",
      description: "Refined taste achievement",
      earned: false
    },
    {
      id: 15,
      name: "Gastronomy Icon",
      image: "/images/Cookpedia_16_Badges/L90_Starlight Chef.png",
      description: "Icon of gastronomy",
      earned: false
    },
    {
      id: 16,
      name: "Cookpedia Pantheon",
      image: "/images/Cookpedia_16_Badges/L100_Cookpedia_Pantheon.png",
      description: "Ultimate cooking achievement",
      earned: false
    }
  ]

  return (
    <>
      <HeroHeader2 />
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-10">
        {/* Profile Card */}
        <Card className="rounded-3xl border-none bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:bg-neutral-900">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">My Badges</h1>
            <p className="text-neutral-600">Collect badges by participating in the community</p>
          </div>

          {/* Badges Display */}
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 bg-neutral-300/70">
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="unearned">Not Yet Earned</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {badges.map((badge) => (
                  <Card key={badge.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="relative mx-auto h-32 w-32">
                      <img 
                        src={badge.image} 
                        alt={badge.name}
                        className={`h-full w-full object-contain ${!badge.earned ? 'opacity-30 grayscale' : ''}`}
                      />
                      {!badge.earned && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          🔒
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{badge.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{badge.description}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="earned" className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {badges.filter(badge => badge.earned).map((badge) => (
                  <Card key={badge.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="relative mx-auto h-32 w-32">
                      <img 
                        src={badge.image} 
                        alt={badge.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{badge.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{badge.description}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unearned" className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {badges.filter(badge => !badge.earned).map((badge) => (
                  <Card key={badge.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="relative mx-auto h-32 w-32">
                      <img 
                        src={badge.image} 
                        alt={badge.name}
                        className="h-full w-full object-contain opacity-30 grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🔒
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{badge.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{badge.description}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  )
}