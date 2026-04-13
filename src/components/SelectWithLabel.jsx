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
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={triggerId}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={triggerId} className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
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
