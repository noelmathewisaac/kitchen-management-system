"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchIngredients, addIngredient, updateIngredient, deleteIngredient } from "@/lib/api/ingredients"
import type { Ingredient } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

// Keys for React Query
export const ingredientKeys = {
  all: ["ingredients"] as const,
  lists: () => [...ingredientKeys.all, "list"] as const,
  list: (filters: any) => [...ingredientKeys.lists(), { filters }] as const,
  details: () => [...ingredientKeys.all, "detail"] as const,
  detail: (id: number) => [...ingredientKeys.details(), id] as const,
}

// Hook to fetch all ingredients
export function useIngredients() {
  return useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: fetchIngredients,
  })
}

// Hook to add an ingredient
export function useAddIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ingredient: Omit<Ingredient, "id">) => addIngredient(ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      toast({
        title: "Ingredient added",
        description: "Your ingredient has been added successfully.",
      })
    },
    onError: (error) => {
      console.error("Error adding ingredient:", error)
      toast({
        variant: "destructive",
        title: "Error adding ingredient",
        description: "There was an error adding your ingredient. Please try again.",
      })
    },
  })
}

// Hook to update an ingredient
export function useUpdateIngredient(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ingredient: Partial<Ingredient>) => updateIngredient(id, ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      toast({
        title: "Ingredient updated",
        description: "Your ingredient has been updated successfully.",
      })
    },
    onError: (error) => {
      console.error("Error updating ingredient:", error)
      toast({
        variant: "destructive",
        title: "Error updating ingredient",
        description: "There was an error updating your ingredient. Please try again.",
      })
    },
  })
}

// Hook to delete an ingredient
export function useDeleteIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() })
      toast({
        title: "Ingredient deleted",
        description: "Your ingredient has been deleted successfully.",
      })
    },
    onError: (error) => {
      console.error("Error deleting ingredient:", error)
      toast({
        variant: "destructive",
        title: "Error deleting ingredient",
        description: "There was an error deleting your ingredient. Please try again.",
      })
    },
  })
}
