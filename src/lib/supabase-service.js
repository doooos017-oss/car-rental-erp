import { supabase } from './supabase'

// ============ CARS ============
export const getCars = async () => {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching cars:', error)
        return []
    }
}

export const addCar = async (car) => {
    try {
        const { data, error } = await supabase
            .from('cars')
            .insert([car])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding car:', error)
        throw error
    }
}

export const updateCar = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error updating car:', error)
        throw error
    }
}

export const deleteCar = async (id) => {
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting car:', error)
        throw error
    }
}

// ============ CUSTOMERS ============
export const getCustomers = async () => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching customers:', error)
        return []
    }
}

export const addCustomer = async (customer) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding customer:', error)
        throw error
    }
}

export const updateCustomer = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error updating customer:', error)
        throw error
    }
}

// ============ CONTRACTS ============
export const getContracts = async () => {
    try {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
        *,
        customers(*),
        cars(*)
      `)

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching contracts:', error)
        return []
    }
}

export const addContract = async (contract) => {
    try {
        const { data, error } = await supabase
            .from('contracts')
            .insert([contract])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding contract:', error)
        throw error
    }
}

export const updateContract = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('contracts')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error updating contract:', error)
        throw error
    }
}

// ============ BRANCHES ============
export const getBranches = async () => {
    try {
        const { data, error } = await supabase
            .from('branches')
            .select('*')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching branches:', error)
        return []
    }
}

export const addBranch = async (branch) => {
    try {
        const { data, error } = await supabase
            .from('branches')
            .insert([branch])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding branch:', error)
        throw error
    }
}

// ============ TRANSACTIONS ============
export const getTransactions = async () => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
}

export const addTransaction = async (transaction) => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transaction])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding transaction:', error)
        throw error
    }
}

// ============ MAINTENANCE ============
export const getMaintenance = async () => {
    try {
        const { data, error } = await supabase
            .from('maintenance')
            .select('*,cars(*)')
            .order('scheduled_date', { ascending: true })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching maintenance:', error)
        return []
    }
}

export const addMaintenance = async (maintenance) => {
    try {
        const { data, error } = await supabase
            .from('maintenance')
            .insert([maintenance])
            .select()

        if (error) throw error
        return data?.[0]
    } catch (error) {
        console.error('Error adding maintenance:', error)
        throw error
    }
}

// ============ REALTIME SUBSCRIPTIONS ============
export const subscribeToChanges = (table, callback) => {
    return supabase
        .channel(`public:${table}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: table },
            callback
        )
        .subscribe()
}
