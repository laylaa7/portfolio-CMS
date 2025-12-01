import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

type Props = {
  title: string
  description?: string
  href: string
  icon?: React.ReactNode
  accentClass?: string
  buttonText?: string
}

export default function AdminCard({ title, description, href, icon, accentClass = "text-primary", buttonText = "Open" }: Props) {
  return (
    <Card className="hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent>
        <Button asChild className={`w-full bg-secondary text-secondary-foreground hover:bg-secondary/90`}>
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
