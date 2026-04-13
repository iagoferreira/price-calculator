import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function InputWithLabel(props) {
  const { label, onChange } = props
  const id = useId()

  return (
    <div className="grid w-full max-w-40 items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} onChange={onChange} />
    </div>
  )
}

export function PrecoInputWithLabel(props) {
  const { label, onChange } = props
  const id = useId()

  return (
    <div className="grid w-full max-w-40 items-center gap-1.5 absolute top-1 right-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} onChange={onChange} />
    </div>
  )
}
