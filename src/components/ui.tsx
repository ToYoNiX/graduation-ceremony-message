import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseField =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/10'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  // dir="auto" lets Arabic (or any RTL) input render right-to-left automatically.
  return <input dir="auto" {...props} className={`${baseField} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea dir="auto" {...props} className={`${baseField} min-h-32 resize-y ${props.className ?? ''}`} />
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles = {
    primary:
      'bg-indigo-500 text-white hover:bg-indigo-400 disabled:bg-indigo-500/40',
    ghost:
      'border border-white/10 text-slate-200 hover:bg-white/5',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 disabled:bg-rose-600/40',
  }[variant]
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition disabled:cursor-not-allowed ${styles} ${className}`}
    />
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 backdrop-blur ${className}`}
    >
      {children}
    </div>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-slate-300">{children}</label>
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
      {children}
    </p>
  )
}
