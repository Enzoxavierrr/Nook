import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
} from '@/components/ui'
import { useLists } from '@/hooks/use-lists'
import { toast } from 'sonner'
import { LIST_COLORS } from '@/types'
import { cn } from '@/lib/utils'
import type { List } from '@/types'

interface ListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  list?: List
}

export function ListDialog({ open, onOpenChange, list }: ListDialogProps) {
  const { createList, updateList } = useLists()
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(LIST_COLORS[0])
  const [loading, setLoading] = useState(false)

  const isEditing = !!list

  useEffect(() => {
    if (list) {
      setName(list.name)
      setColor(list.color || LIST_COLORS[0])
    } else {
      setName('')
      setColor(LIST_COLORS[0])
    }
  }, [list, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (name.trim().length > 50) {
      toast.error('O nome da lista não pode ter mais de 50 caracteres')
      return
    }

    setLoading(true)

    if (isEditing) {
      await updateList(list.id, { name, color })
    } else {
      await createList(name, color)
    }

    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar lista' : 'Nova lista'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">Nome da lista</Label>
              <Input
                id="list-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Trabalho, Pessoal, Estudos..."
                autoFocus
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {LIST_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'h-8 w-8 rounded-full transition-transform hover:scale-110',
                      color === c && 'ring-2 ring-offset-2 ring-ring'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

