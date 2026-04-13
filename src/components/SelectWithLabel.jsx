import { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export function SelectWithLabel(props) {
  const { label, onValueChange, options, value } = props
  const triggerId = useId()

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label
        htmlFor={triggerId}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={triggerId} className="h-9 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => (
              <SelectItem value={option} key={index}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
