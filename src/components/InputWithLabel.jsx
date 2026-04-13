import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function InputWithLabel(props) {
  const { label, onChange } = props
  const id = useId()

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Input id={id} onChange={onChange} className="h-9" />
    </div>
  )
}

export function PrecoInputWithLabel(props) {
  const { label, onChange } = props
  const id = useId()

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Input id={id} onChange={onChange} className="h-9" />
    </div>
  )
}
