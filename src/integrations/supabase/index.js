import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### items

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |
| name       | text                     | string | false    |

*/

export const useItems = () => useQuery({
    queryKey: ['items'],
    queryFn: () => fromSupabase(supabase.from('items').select('*')),
});

export const useAddItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newItem) => fromSupabase(supabase.from('items').insert([{ name: newItem.name }])),
        onSuccess: () => {
            queryClient.invalidateQueries('items');
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedItem) => fromSupabase(supabase.from('items').update({ name: updatedItem.name }).eq('id', updatedItem.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('items');
        },
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId) => fromSupabase(supabase.from('items').delete().eq('id', itemId)),
        onSuccess: () => {
            queryClient.invalidateQueries('items');
        },
    });
};