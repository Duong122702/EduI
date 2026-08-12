import {
  Atom,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

interface SubjectPaths {
  icon: LucideIcon;
  name: string;
  badgeStyle: string;
}

export const SUBJECT_PATHS: Record<string, SubjectPaths> = {
  'Toán học': {
    icon: Calculator,
    name: 'Toán học',
    badgeStyle:
      'border-emerald-200/60 bg-emerald-50 text-emerald-600 hover:bg-emerald-50',
  },
  'Vật lý': {
    icon: Atom,
    name: 'Vật lý',
    badgeStyle:
      'border-purple-200/60 bg-purple-50 text-purple-600 hover:bg-purple-50',
  },
  'Hóa học': {
    icon: FlaskConical,
    name: 'Hóa học',
    badgeStyle: 'border-blue-200/60 bg-blue-50 text-blue-600 hover:bg-blue-50',
  },
  'Ngữ Văn': {
    icon: BookOpen,
    name: 'Ngữ văn',
    badgeStyle:
      'border-amber-200/60 bg-amber-50 text-amber-600 hover:bg-amber-50',
  },
  'Địa lý': {
    icon: Globe,
    name: 'Địa lý',
    badgeStyle: 'border-cyan-200/60 bg-cyan-50 text-cyan-600 hover:bg-cyan-50',
  },
};

export const DEFAULT_SUBJECT_PATHS: SubjectPaths = {
  icon: HelpCircle,
  name: 'Môn học khác',
  badgeStyle: 'border-gray-200/60 bg-gray-50 text-gray-600 hover:bg-gray-50',
};
