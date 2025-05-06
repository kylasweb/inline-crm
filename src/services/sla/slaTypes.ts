/**
 * @typedef SLA
 * @property {string} id - The unique identifier of the SLA.
 * @property {string} name - The name of the SLA.
 * @property {string} description - A description of the SLA.
 * @property {number} targetResolutionTime - The target resolution time in hours.
 * @property {Date} createdAt - The date the SLA was created.
 * @property {Date} updatedAt - The date the SLA was last updated.
 */
export interface SLA {
  id: string;
  name: string;
  description: string;
  targetResolutionTime: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef EscalationRule
 * @property {string} id - The unique identifier of the escalation rule.
 * @property {string} slaId - The ID of the SLA this rule belongs to.
 * @property {number} escalationLevel - The level of escalation (e.g., 1, 2, 3).
 * @property {number} timeBeforeEscalation - The time before escalation in hours.
 * @property {string} assigneeGroupId - The ID of the group to assign the ticket to.
 * @property {Date} createdAt - The date the escalation rule was created.
 * @property {Date} updatedAt - The date the escalation rule was last updated.
 */
export interface EscalationRule {
  id: string;
  slaId: string;
  escalationLevel: number;
  timeBeforeEscalation: number;
  assigneeGroupId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef Ticket
 * @property {string} id - The unique identifier of the ticket.
 * @property {string} title - The title of the ticket.
 * @property {string} description - A description of the ticket.
 * @property {string} status - The status of the ticket (e.g., "Open", "In Progress", "Resolved").
 * @property {string} priority - The priority of the ticket (e.g., "High", "Medium", "Low").
 * @property {Date} createdAt - The date the ticket was created.
 * @property {Date} updatedAt - The date the ticket was last updated.
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @typedef Event
 * @property {string} id - The unique identifier of the event.
 * @property {string} ticketId - The ID of the ticket the event is associated with.
 * @property {string} type - The type of event (e.g., "Ticket Created", "Status Changed", "Escalated").
 * @property {string} description - A description of the event.
 * @property {Date} createdAt - The date the event was created.
 */
export interface Event {
  id: string;
  ticketId: string;
  type: string;
  description: string;
  createdAt: Date;
}

/**
 * @typedef Metric
 * @property {string} id - The unique identifier of the metric.
 * @property {string} ticketId - The ID of the ticket the metric is associated with.
 * @property {string} type - The type of metric (e.g., "Time to Resolution", "First Response Time").
 * @property {number} value - The value of the metric.
 * @property {Date} createdAt - The date the metric was calculated.
 */
export interface Metric {
  id: string;
  ticketId: string;
  type: string;
  value: number;
  createdAt: Date;
}