import {
  Briefcase, MapPin, Clock, DollarSign, Bookmark,
  ExternalLink, Search, SlidersHorizontal, Building2, Zap, Linkedin,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  match: number;
  tags: string[];
  logo: string;
  logoColor: string;
  remote: boolean;
  linkedinSearch: string;
};

const jobListings: Job[] = [
  {
    id: 1,
    title: "Data Scientist",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$140k – $180k",
    posted: "2 days ago",
    match: 94,
    tags: ["Python", "ML", "TensorFlow"],
    logo: "G",
    logoColor: "bg-blue-500",
    remote: true,
    linkedinSearch: "Data Scientist Google",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160k – $210k",
    posted: "1 day ago",
    match: 89,
    tags: ["PyTorch", "LLMs", "Python"],
    logo: "O",
    logoColor: "bg-emerald-500",
    remote: false,
    linkedinSearch: "Machine Learning Engineer OpenAI",
  },
  {
    id: 3,
    title: "Product Data Analyst",
    company: "Stripe",
    location: "Remote",
    type: "Full-time",
    salary: "$110k – $140k",
    posted: "3 days ago",
    match: 85,
    tags: ["SQL", "Analytics", "Looker"],
    logo: "S",
    logoColor: "bg-violet-500",
    remote: true,
    linkedinSearch: "Product Data Analyst Stripe",
  },
  {
    id: 4,
    title: "AI/ML Research Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Internship",
    salary: "$8k/month",
    posted: "5 days ago",
    match: 79,
    tags: ["Research", "NLP", "Python"],
    logo: "M",
    logoColor: "bg-blue-600",
    remote: false,
    linkedinSearch: "AI ML Research Intern Meta",
  },
  {
    id: 5,
    title: "Senior Data Engineer",
    company: "Airbnb",
    location: "Remote",
    type: "Full-time",
    salary: "$150k – $190k",
    posted: "1 week ago",
    match: 76,
    tags: ["Spark", "Kafka", "dbt"],
    logo: "A",
    logoColor: "bg-rose-500",
    remote: true,
    linkedinSearch: "Senior Data Engineer Airbnb",
  },
  {
    id: 6,
    title: "Business Intelligence Developer",
    company: "Salesforce",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$95k – $125k",
    posted: "4 days ago",
    match: 71,
    tags: ["Tableau", "SQL", "Power BI"],
    logo: "SF",
    logoColor: "bg-sky-500",
    remote: false,
    linkedinSearch: "Business Intelligence Developer Salesforce",
  },
];

const filters = ["All", "Remote", "Full-time", "Internship"];

function getLinkedInUrl(job: Job): string {
  const keywords = encodeURIComponent(job.linkedinSearch);
  return `https://www.linkedin.com/jobs/search/?keywords=${keywords}&f_TPR=r86400`;
}

function applyOnLinkedIn(job: Job) {
  window.open(getLinkedInUrl(job), "_blank", "noopener,noreferrer");
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set([1, 5]));

  const filtered = jobListings.filter((j) => {
    const matchesSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Remote" && j.remote) ||
      j.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  function toggleSave(id: number) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function matchColor(pct: number) {
    if (pct >= 90) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
    if (pct >= 80) return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20";
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/25">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Matches</h1>
          <p className="text-sm text-muted-foreground">Roles matched to your skills and career goals</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>{filtered.length} matches found</span>
        </div>
      </div>

      {/* LinkedIn banner */}
      <div className="flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
        <Linkedin className="h-5 w-5 text-[#0077B5] shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300 flex-1">
          Click <span className="font-semibold">Apply</span> on any job to search for it directly on LinkedIn in a new tab.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title or company..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl shrink-0">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
              activeFilter === f
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="space-y-3">
        {filtered.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0", job.logoColor)}>
                  {job.logo}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-base">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.posted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded-lg", matchColor(job.match))}>
                        {job.match}% match
                      </span>
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          savedJobs.has(job.id)
                            ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <Bookmark className="h-4 w-4" fill={savedJobs.has(job.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="h-3.5 w-3.5" />{job.salary}
                      </span>
                      <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                      {job.remote && <Badge variant="outline" className="text-xs">Remote</Badge>}
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{tag}</span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg shrink-0 bg-[#0077B5] hover:bg-[#006097] text-white"
                      onClick={() => applyOnLinkedIn(job)}
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      Apply on LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs match your search</p>
            <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
