import axiosInstance from '@/api/axiosInstance'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import DeleteIcon from '@mui/icons-material/Delete'
import { useQueryClient } from 'react-query'
import { useToast } from './ui/use-toast'

type DeleteExpenseDialogProps = {
  id: string
}

export function DeleteExpenseDialog({ id }: DeleteExpenseDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/expense/${id}`)
      toast({
        title: 'Sucesso',
        description: 'Despesa deletada com sucesso',
      })
      queryClient.invalidateQueries({
        queryKey: ['expense'],
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description:
          error.response?.data.message || 'Ocorreu um erro inesperado',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <DeleteIcon sx={{ color: 'red' }} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
          <AlertDialogDescription>
            Se você deletar, não será possível recuperar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500" onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
