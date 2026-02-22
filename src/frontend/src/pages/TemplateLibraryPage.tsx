import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Library, Play } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  style: string;
}

const templates: Template[] = [
  {
    id: 'template-1',
    title: 'Viral News Breakdown',
    description: 'Perfect for breaking news and trending stories with dramatic storytelling',
    category: 'News',
    duration: '30s',
    style: 'Dramatic',
  },
  {
    id: 'template-2',
    title: 'Product Review',
    description: 'Showcase products with engaging visuals and honest reviews',
    category: 'Review',
    duration: '45s',
    style: 'Informative',
  },
  {
    id: 'template-3',
    title: 'Motivational Quote',
    description: 'Inspire your audience with powerful quotes and emotional music',
    category: 'Motivation',
    duration: '30s',
    style: 'Emotional',
  },
  {
    id: 'template-4',
    title: 'Tech Tutorial',
    description: 'Quick tech tips and tutorials with clear step-by-step visuals',
    category: 'Education',
    duration: '60s',
    style: 'Educational',
  },
  {
    id: 'template-5',
    title: 'Comedy Skit',
    description: 'Funny moments and relatable content with upbeat music',
    category: 'Entertainment',
    duration: '30s',
    style: 'Fun',
  },
  {
    id: 'template-6',
    title: 'Fitness Challenge',
    description: 'High-energy workout content with motivational voiceover',
    category: 'Fitness',
    duration: '45s',
    style: 'Energetic',
  },
];

export default function TemplateLibraryPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real app, this would initialize a new project with the template
    // For now, we'll navigate to trending to select a topic
    navigate({ to: '/trending' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Library className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Template Library</h1>
        </div>
        <p className="text-muted-foreground">
          Choose from pre-configured video templates to jumpstart your content creation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader>
              <div className="aspect-video bg-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                <img
                  src="/assets/generated/template-placeholder.dim_400x300.png"
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {template.duration}
                </Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline">{template.category}</Badge>
                  <Badge variant="outline">{template.style}</Badge>
                </div>
                <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
