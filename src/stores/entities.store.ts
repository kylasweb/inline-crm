import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Entity Types
export interface Account {
  id: string
  name: string
  email: string
  phone?: string
  type: string
  status: string
  updatedAt: string
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  status: string
  score?: number
  assignedTo?: string
  notes?: string
  updatedAt: string
  createdAt: string
}

export interface Opportunity {
  id: string
  title: string
  accountId: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: string
  notes?: string
  updatedAt: string
  createdAt: string
}

export interface Quotation {
  id: string
  number: string
  accountId: string
  opportunityId: string
  total: number
  status: string
  validUntil: string
  notes?: string
  updatedAt: string
  createdAt: string
}

interface EntitiesState {
  accounts: Record<string, Account>
  leads: Record<string, Lead>
  opportunities: Record<string, Opportunity>
  quotations: Record<string, Quotation>
  
  // Account actions
  setAccount: (account: Account) => void
  removeAccount: (id: string) => void
  setAccounts: (accounts: Account[]) => void
  
  // Lead actions
  setLead: (lead: Lead) => void
  removeLead: (id: string) => void
  setLeads: (leads: Lead[]) => void
  
  // Opportunity actions
  setOpportunity: (opportunity: Opportunity) => void
  removeOpportunity: (id: string) => void
  setOpportunities: (opportunities: Opportunity[]) => void
  
  // Quotation actions
  setQuotation: (quotation: Quotation) => void
  removeQuotation: (id: string) => void
  setQuotations: (quotations: Quotation[]) => void
  
  // Utility actions
  clear: () => void
}

const initialState = {
  accounts: {},
  leads: {},
  opportunities: {},
  quotations: {}
}

export const useEntitiesStore = create<EntitiesState>()(
  persist(
    (set) => ({
      ...initialState,

      // Account actions
      setAccount: (account) => set((state) => ({
        accounts: { ...state.accounts, [account.id]: account }
      })),
      removeAccount: (id) => set((state) => {
        const { [id]: removed, ...accounts } = state.accounts
        return { accounts }
      }),
      setAccounts: (accounts) => set((state) => ({
        accounts: accounts.reduce((acc, account) => {
          acc[account.id] = account
          return acc
        }, {} as Record<string, Account>)
      })),

      // Lead actions
      setLead: (lead) => set((state) => ({
        leads: { ...state.leads, [lead.id]: lead }
      })),
      removeLead: (id) => set((state) => {
        const { [id]: removed, ...leads } = state.leads
        return { leads }
      }),
      setLeads: (leads) => set((state) => ({
        leads: leads.reduce((acc, lead) => {
          acc[lead.id] = lead
          return acc
        }, {} as Record<string, Lead>)
      })),

      // Opportunity actions
      setOpportunity: (opportunity) => set((state) => ({
        opportunities: { ...state.opportunities, [opportunity.id]: opportunity }
      })),
      removeOpportunity: (id) => set((state) => {
        const { [id]: removed, ...opportunities } = state.opportunities
        return { opportunities }
      }),
      setOpportunities: (opportunities) => set((state) => ({
        opportunities: opportunities.reduce((acc, opportunity) => {
          acc[opportunity.id] = opportunity
          return acc
        }, {} as Record<string, Opportunity>)
      })),

      // Quotation actions
      setQuotation: (quotation) => set((state) => ({
        quotations: { ...state.quotations, [quotation.id]: quotation }
      })),
      removeQuotation: (id) => set((state) => {
        const { [id]: removed, ...quotations } = state.quotations
        return { quotations }
      }),
      setQuotations: (quotations) => set((state) => ({
        quotations: quotations.reduce((acc, quotation) => {
          acc[quotation.id] = quotation
          return acc
        }, {} as Record<string, Quotation>)
      })),

      // Utility actions
      clear: () => set(initialState)
    }),
    {
      name: 'entities-storage',
    }
  )
)