import { Badge } from '@/components/ui/badge';
import { DEFAULT_SUBJECT_PATHS, SUBJECT_PATHS } from '@/constants/subjectPaths';
import { cn } from '@/lib/utils';

interface SubjectBadgeProps {
  subject: string;
  topic?: string;
}

export const SubjectBadge = ({ subject, topic }: SubjectBadgeProps) => {
  const matchedKey = Object.keys(SUBJECT_PATHS).find(
    (key) => key.toLowerCase() === subject?.toLowerCase()
  );

  const config = matchedKey ? SUBJECT_PATHS[matchedKey] : DEFAULT_SUBJECT_PATHS;
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="font-bold text-slate-900">{config.name}</p>
        {topic && (
          <Badge
            variant="outline"
            className={cn('text-[10px] font-bold uppercase', config.badgeStyle)}
          >
            {topic}
          </Badge>
        )}
      </div>
    </div>
  );
};
