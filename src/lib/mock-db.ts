/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashToken } from './crypto/tokens'
import { hashPassword } from './crypto/password'

// In-memory data store for AI Studio container environment where MongoDB is not running.
export interface MockEvent {
  id: string
  name: string
  tagline: string | null
  startsAt: Date
  timezone: string
  venueName: string
  address: string
  dressCode: string | null
  rsvpDeadline: Date
  seatsReleasedAt: Date | null
  brandTokens: Record<string, unknown> | null
  floorplanAssetId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface MockAgendaItem {
  id: string
  eventId: string
  startsAt: Date
  title: string
  description: string | null
  icon: string | null
  sortOrder: number
}

export interface MockMealOption {
  id: string
  eventId: string
  label: string
  description: string | null
  sortOrder: number
  isActive: boolean
}

export interface MockTableMarker {
  id: string
  eventId: string
  tableNumber: string
  x: number
  y: number
}

export interface MockGuest {
  id: string
  inviteId: string
  firstName: string
  lastName: string
  badgeName: string | null
  company: string | null
  title: string | null
  email: string | null
  phone: string | null
  isPrimary: boolean
  attending: boolean | null
  mealOptionId: string | null
  dietary: string[]
  accessibilityNeeds: string | null
  tableNumber: string | null
  checkedInAt: Date | null
  checkedInById: string | null
  createdAt: Date
  updatedAt: Date
}

export interface MockInvite {
  id: string
  tokenHash: string
  tokenCipher: string
  number: number
  label: string
  seatsAllotted: number
  status: 'PENDING' | 'ATTENDING' | 'DECLINED' | 'PARTIAL'
  tableNumber: string | null
  adminNotes: string | null
  respondedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface MockAdminUser {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'OWNER' | 'ADMIN' | 'STAFF'
  isActive: boolean
  mustChangePassword: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface MockAdminSession {
  id: string
  tokenHash: string
  userId: string
  expiresAt: Date
  ip: string | null
  userAgent: string | null
  createdAt: Date
}

export interface MockAuditLog {
  id: string
  actorId: string | null
  action: string
  entity: string
  entityId: string | null
  meta: Record<string, unknown> | null
  ip: string | null
  createdAt: Date
}

let seedPromise: Promise<void> | null = null

class InMemoryStore {
  event: MockEvent | null = null
  agendaItems: MockAgendaItem[] = []
  mealOptions: MockMealOption[] = []
  tableMarkers: MockTableMarker[] = []
  invites: MockInvite[] = []
  guests: MockGuest[] = []
  adminUsers: MockAdminUser[] = []
  adminSessions: MockAdminSession[] = []
  auditLogs: MockAuditLog[] = []
  loginAttempts: Array<{ id: string; email: string; succeeded: boolean; ip: string | null; createdAt: Date }> = []

  initSeed(): Promise<void> {
    if (!seedPromise) {
      seedPromise = this.doSeed()
    }
    return seedPromise
  }

  private async doSeed() {
    const eventId = 'event_gala_2026'
    this.event = {
      id: eventId,
      name: 'The 2026 Annual Gala',
      tagline: 'An evening of recognition and celebration',
      startsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days in future
      timezone: 'America/New_York',
      venueName: 'The Grand Hall',
      address: '100 Broadway, New York, NY 10005',
      dressCode: 'Black Tie',
      rsvpDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      seatsReleasedAt: new Date(Date.now() - 1000 * 60 * 60), // Released
      brandTokens: null,
      floorplanAssetId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.agendaItems = [
      { id: 'agenda_1', eventId, title: 'Cocktail reception', startsAt: new Date(this.event.startsAt.getTime()), description: 'Champagne and canapés in the atrium.', icon: null, sortOrder: 0 },
      { id: 'agenda_2', eventId, title: 'Dinner service', startsAt: new Date(this.event.startsAt.getTime() + 60 * 60 * 1000), description: 'Seated four-course dinner in the Grand Ballroom.', icon: null, sortOrder: 1 },
      { id: 'agenda_3', eventId, title: 'Awards ceremony', startsAt: new Date(this.event.startsAt.getTime() + 150 * 60 * 1000), description: 'Honoring excellence and partnership.', icon: null, sortOrder: 2 },
      { id: 'agenda_4', eventId, title: 'After-party', startsAt: new Date(this.event.startsAt.getTime() + 240 * 60 * 1000), description: 'Live entertainment and networking.', icon: null, sortOrder: 3 },
    ]

    this.mealOptions = [
      { id: 'meal_1', eventId, label: 'Braised Beef Short Rib', description: 'With truffle mashed potatoes and glazed heirloom carrots', sortOrder: 0, isActive: true },
      { id: 'meal_2', eventId, label: 'Pan-Seared Halibut', description: 'With saffron risotto and shaved asparagus', sortOrder: 1, isActive: true },
      { id: 'meal_3', eventId, label: 'Wild Mushroom Risotto', description: 'Aged parmesan and thyme reduction (Vegetarian)', sortOrder: 2, isActive: true },
      { id: 'meal_4', eventId, label: 'Roasted Cauliflower Steak', description: 'With tahini, pomegranate, and ancient grains (Vegan)', sortOrder: 3, isActive: true },
    ]

    this.tableMarkers = [
      { id: 'tm_1', eventId, tableNumber: '1', x: 25, y: 30 },
      { id: 'tm_2', eventId, tableNumber: '2', x: 50, y: 30 },
      { id: 'tm_3', eventId, tableNumber: '4', x: 75, y: 30 },
      { id: 'tm_4', eventId, tableNumber: '7', x: 50, y: 65 },
    ]

    // Default admin user (owner@example.com / hunter2hunter2)
    let pwHash = '$argon2id$v=19$m=19456,t=2,p=1$7v1YxL9f6U$placeholder'
    try {
      pwHash = await hashPassword('hunter2hunter2')
    } catch {
      // fallback
    }

    this.adminUsers = [
      {
        id: 'admin_owner_1',
        email: 'owner@example.com',
        name: 'Event Owner',
        passwordHash: pwHash,
        role: 'OWNER',
        isActive: true,
        mustChangePassword: false,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Pre-seed sample invites
    const sampleInvitesConfig = [
      {
        id: 'inv_1',
        label: 'Reyes Party',
        tokens: ['sample-token', 'reyes-token'],
        seatsAllotted: 2,
        number: 1,
        tableNumber: '4',
        guests: [
          { firstName: 'Jordan', lastName: 'Reyes', email: 'jordan.reyes@example.com', company: 'Northwind', title: 'VP Operations', isPrimary: true, attending: true, mealOptionId: 'meal_1' },
          { firstName: 'Taylor', lastName: 'Reyes', email: 'taylor.reyes@example.com', company: 'Northwind', title: 'Partner', isPrimary: false, attending: true, mealOptionId: 'meal_3' },
        ],
      },
      {
        id: 'inv_2',
        label: 'Okafor Party',
        tokens: ['okafor-token'],
        seatsAllotted: 2,
        number: 2,
        tableNumber: '7',
        guests: [
          { firstName: 'Ada', lastName: 'Okafor', email: 'ada.okafor@example.com', company: 'Acme Corp', title: 'Chief Counsel', isPrimary: true, attending: true, mealOptionId: 'meal_2' },
          { firstName: 'Nnamdi', lastName: 'Okafor', email: 'nnamdi.okafor@example.com', company: 'Acme Corp', title: 'Director', isPrimary: false, attending: null, mealOptionId: null },
        ],
      },
      {
        id: 'inv_3',
        label: 'Lindqvist Party',
        tokens: ['lindqvist-token'],
        seatsAllotted: 1,
        number: 3,
        tableNumber: '2',
        guests: [
          { firstName: 'Mira', lastName: 'Lindqvist', email: 'mira.lindqvist@example.com', company: 'Helios Research', title: 'Director of Research', isPrimary: true, attending: null, mealOptionId: null },
        ],
      },
    ]

    for (const inv of sampleInvitesConfig) {
      const primaryToken = inv.tokens[0]!
      const inviteRecord: MockInvite = {
        id: inv.id,
        tokenHash: hashToken(primaryToken),
        tokenCipher: 'cipher_' + inv.id,
        number: inv.number,
        label: inv.label,
        seatsAllotted: inv.seatsAllotted,
        status: inv.guests.every((g) => g.attending === true) ? 'ATTENDING' : 'PENDING',
        tableNumber: inv.tableNumber,
        adminNotes: null,
        respondedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.invites.push(inviteRecord)

      // Also register alternate tokens pointing to the same invite
      for (const altToken of inv.tokens.slice(1)) {
        this.invites.push({
          ...inviteRecord,
          id: `${inv.id}_${altToken}`,
          tokenHash: hashToken(altToken),
        })
      }

      for (let i = 0; i < inv.guests.length; i++) {
        const g = inv.guests[i]!
        this.guests.push({
          id: `gst_${inv.id}_${i}`,
          inviteId: inv.id,
          firstName: g.firstName,
          lastName: g.lastName,
          badgeName: null,
          company: g.company,
          title: g.title,
          email: g.email,
          phone: null,
          isPrimary: g.isPrimary,
          attending: g.attending,
          mealOptionId: g.mealOptionId,
          dietary: [],
          accessibilityNeeds: null,
          tableNumber: inv.tableNumber,
          checkedInAt: null,
          checkedInById: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }
  }
}

const store = new InMemoryStore()
// Kick off initial seed in background
store.initSeed().catch(() => {})

export function createMockPrisma() {
  const mock = {
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: async (arg: any) => {
      await store.initSeed()
      if (Array.isArray(arg)) {
        return Promise.all(arg)
      }
      if (typeof arg === 'function') {
        return arg(mock)
      }
      return arg
    },

    event: {
      findFirst: async (args?: any) => {
        await store.initSeed()
        if (!store.event) return null
        const ev = { ...store.event }
        if (args?.select) {
          const res: any = {}
          for (const key of Object.keys(args.select)) {
            if (key === 'agendaItems') {
              res.agendaItems = [...store.agendaItems].sort((a, b) => a.sortOrder - b.sortOrder)
            } else if (key === 'mealOptions') {
              res.mealOptions = [...store.mealOptions].sort((a, b) => a.sortOrder - b.sortOrder)
            } else if (key === 'tableMarkers') {
              res.tableMarkers = [...store.tableMarkers].sort((a, b) => a.tableNumber.localeCompare(b.tableNumber))
            } else if (key in ev) {
              res[key] = (ev as any)[key]
            }
          }
          return res
        }
        return {
          ...ev,
          agendaItems: store.agendaItems,
          mealOptions: store.mealOptions,
          tableMarkers: store.tableMarkers,
        }
      },
      count: async () => {
        await store.initSeed()
        return store.event ? 1 : 0
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const id = 'event_' + Date.now()
        store.event = {
          id,
          name: data.name ?? 'The 2026 Annual Gala',
          tagline: data.tagline ?? null,
          startsAt: data.startsAt instanceof Date ? data.startsAt : new Date(data.startsAt),
          timezone: data.timezone ?? 'UTC',
          venueName: data.venueName ?? '',
          address: data.address ?? '',
          dressCode: data.dressCode ?? null,
          rsvpDeadline: data.rsvpDeadline instanceof Date ? data.rsvpDeadline : new Date(data.rsvpDeadline),
          seatsReleasedAt: data.seatsReleasedAt ? new Date(data.seatsReleasedAt) : null,
          brandTokens: data.brandTokens ?? null,
          floorplanAssetId: data.floorplanAssetId ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return store.event
      },
      update: async ({ data }: any) => {
        await store.initSeed()
        if (store.event) {
          Object.assign(store.event, data, { updatedAt: new Date() })
        }
        return store.event
      },
    },

    agendaItem: {
      findMany: async () => {
        await store.initSeed()
        return [...store.agendaItems].sort((a, b) => a.sortOrder - b.sortOrder)
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const item: MockAgendaItem = {
          id: 'agenda_' + Date.now(),
          eventId: data.eventId ?? store.event?.id ?? 'event_gala_2026',
          title: data.title,
          startsAt: data.startsAt instanceof Date ? data.startsAt : new Date(data.startsAt),
          description: data.description ?? null,
          icon: data.icon ?? null,
          sortOrder: data.sortOrder ?? store.agendaItems.length,
        }
        store.agendaItems.push(item)
        return item
      },
      delete: async ({ where }: any) => {
        await store.initSeed()
        const idx = store.agendaItems.findIndex((a) => a.id === where.id)
        if (idx !== -1) {
          const removed = store.agendaItems.splice(idx, 1)[0]
          return removed
        }
        return { id: where.id }
      },
    },

    mealOption: {
      findMany: async () => {
        await store.initSeed()
        return [...store.mealOptions].sort((a, b) => a.sortOrder - b.sortOrder)
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const meal: MockMealOption = {
          id: 'meal_' + Date.now(),
          eventId: data.eventId ?? store.event?.id ?? 'event_gala_2026',
          label: data.label,
          description: data.description ?? null,
          sortOrder: data.sortOrder ?? store.mealOptions.length,
          isActive: data.isActive ?? true,
        }
        store.mealOptions.push(meal)
        return meal
      },
      update: async ({ where, data }: any) => {
        await store.initSeed()
        const meal = store.mealOptions.find((m) => m.id === where.id)
        if (meal) Object.assign(meal, data)
        return meal
      },
    },

    tableMarker: {
      findMany: async () => {
        await store.initSeed()
        return [...store.tableMarkers]
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const tm = { id: 'tm_' + Date.now(), ...data }
        store.tableMarkers.push(tm)
        return tm
      },
      deleteMany: async () => {
        await store.initSeed()
        const count = store.tableMarkers.length
        store.tableMarkers = []
        return { count }
      },
      createMany: async ({ data }: any) => {
        await store.initSeed()
        const items = Array.isArray(data) ? data : [data]
        for (const item of items) {
          store.tableMarkers.push({ id: 'tm_' + Math.random(), ...item })
        }
        return { count: items.length }
      },
    },

    invite: {
      findUnique: async (args: any) => {
        await store.initSeed()
        const where = args.where
        let inv: MockInvite | undefined
        if (where.tokenHash) {
          inv = store.invites.find((i) => i.tokenHash === where.tokenHash)
        } else if (where.id) {
          inv = store.invites.find((i) => i.id === where.id)
        } else if (where.number !== undefined) {
          inv = store.invites.find((i) => i.number === where.number)
        }
        if (!inv) return null

        const guests = store.guests
          .filter((g) => g.inviteId === (inv!.id.includes('_') ? inv!.id.split('_')[0] : inv!.id))
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))

        if (args.select) {
          const res: any = {}
          for (const k of Object.keys(args.select)) {
            if (k === 'guests') {
              res.guests = guests
            } else if (k === '_count') {
              res._count = { guests: guests.length }
            } else {
              res[k] = (inv as any)[k]
            }
          }
          return res
        }

        return { ...inv, guests }
      },
      findFirst: async (args?: any) => {
        await store.initSeed()
        if (args?.orderBy?.number === 'desc') {
          const sorted = [...store.invites].sort((a, b) => b.number - a.number)
          return sorted[0] ?? null
        }
        return store.invites[0] ?? null
      },
      findMany: async (args?: any) => {
        await store.initSeed()
        let list = [...store.invites]
        if (args?.where?.status) {
          list = list.filter((i) => i.status === args.where.status)
        }
        if (args?.where?.label?.contains) {
          const q = args.where.label.contains.toLowerCase()
          list = list.filter((i) => i.label.toLowerCase().includes(q))
        }
        return list.map((inv) => {
          const guestCount = store.guests.filter((g) => g.inviteId === inv.id).length
          return {
            ...inv,
            guestCount,
            _count: { guests: guestCount },
          }
        })
      },
      count: async (args?: any) => {
        await store.initSeed()
        if (args?.where?.status) {
          return store.invites.filter((i) => i.status === args.where.status).length
        }
        return store.invites.length
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const id = 'inv_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
        const inv: MockInvite = {
          id,
          tokenHash: data.tokenHash ?? 'th_' + id,
          tokenCipher: data.tokenCipher ?? 'tc_' + id,
          number: data.number ?? (store.invites.length + 1),
          label: data.label ?? 'New Party',
          seatsAllotted: data.seatsAllotted ?? 1,
          status: data.status ?? 'PENDING',
          tableNumber: data.tableNumber ?? null,
          adminNotes: data.adminNotes ?? null,
          respondedAt: data.respondedAt ? new Date(data.respondedAt) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.invites.push(inv)
        return inv
      },
      update: async ({ where, data }: any) => {
        await store.initSeed()
        const inv = store.invites.find((i) => i.id === where.id)
        if (inv) {
          Object.assign(inv, data, { updatedAt: new Date() })
        }
        return inv
      },
      delete: async ({ where }: any) => {
        await store.initSeed()
        const idx = store.invites.findIndex((i) => i.id === where.id)
        if (idx !== -1) {
          return store.invites.splice(idx, 1)[0]
        }
        return { id: where.id }
      },
      groupBy: async () => {
        await store.initSeed()
        const counts: Record<string, number> = {}
        for (const inv of store.invites) {
          counts[inv.status] = (counts[inv.status] || 0) + 1
        }
        return Object.entries(counts).map(([status, count]) => ({ status, _count: { _all: count } }))
      },
    },

    guest: {
      findMany: async (args?: any) => {
        await store.initSeed()
        let list = [...store.guests]
        if (args?.where?.inviteId) {
          list = list.filter((g) => g.inviteId === args.where.inviteId)
        }
        if (args?.where?.attending !== undefined) {
          list = list.filter((g) => g.attending === args.where.attending)
        }
        if (args?.where?.mealOptionId) {
          list = list.filter((g) => g.mealOptionId === args.where.mealOptionId)
        }
        if (args?.where?.checkedInAt) {
          list = list.filter((g) => g.checkedInAt !== null)
        }
        return list.map((g) => {
          const inv = store.invites.find((i) => i.id === g.inviteId)
          const meal = store.mealOptions.find((m) => m.id === g.mealOptionId)
          return {
            ...g,
            invite: inv ? { label: inv.label, tableNumber: inv.tableNumber } : null,
            mealOption: meal ?? null,
          }
        })
      },
      findUnique: async ({ where }: any) => {
        await store.initSeed()
        return store.guests.find((g) => g.id === where.id) ?? null
      },
      count: async (args?: any) => {
        await store.initSeed()
        let list = store.guests
        if (args?.where?.attending !== undefined) {
          list = list.filter((g) => g.attending === args.where.attending)
        }
        if (args?.where?.checkedInAt) {
          list = list.filter((g) => g.checkedInAt !== null)
        }
        return list.length
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const guest: MockGuest = {
          id: 'gst_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          inviteId: data.inviteId,
          firstName: data.firstName,
          lastName: data.lastName,
          badgeName: data.badgeName ?? null,
          company: data.company ?? null,
          title: data.title ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          isPrimary: data.isPrimary ?? false,
          attending: data.attending ?? null,
          mealOptionId: data.mealOptionId ?? null,
          dietary: data.dietary ?? [],
          accessibilityNeeds: data.accessibilityNeeds ?? null,
          tableNumber: data.tableNumber ?? null,
          checkedInAt: null,
          checkedInById: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.guests.push(guest)
        return guest
      },
      update: async ({ where, data }: any) => {
        await store.initSeed()
        const guest = store.guests.find((g) => g.id === where.id)
        if (guest) Object.assign(guest, data, { updatedAt: new Date() })
        return guest
      },
      delete: async ({ where }: any) => {
        await store.initSeed()
        const idx = store.guests.findIndex((g) => g.id === where.id)
        if (idx !== -1) {
          return store.guests.splice(idx, 1)[0]
        }
        return { id: where.id }
      },
    },

    adminUser: {
      findUnique: async (args: any) => {
        await store.initSeed()
        const where = args.where
        let user: MockAdminUser | undefined
        if (where.email) {
          user = store.adminUsers.find((u) => u.email.toLowerCase() === where.email.toLowerCase())
        } else if (where.id) {
          user = store.adminUsers.find((u) => u.id === where.id)
        }
        if (!user) return null
        if (args.select) {
          const res: any = {}
          for (const k of Object.keys(args.select)) {
            res[k] = (user as any)[k]
          }
          return res
        }
        return { ...user }
      },
      findFirst: async () => {
        await store.initSeed()
        return store.adminUsers[0] ?? null
      },
      findMany: async () => {
        await store.initSeed()
        return [...store.adminUsers]
      },
      count: async () => {
        await store.initSeed()
        return store.adminUsers.length
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const u: MockAdminUser = {
          id: 'admin_' + Date.now(),
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          role: data.role ?? 'ADMIN',
          isActive: data.isActive ?? true,
          mustChangePassword: data.mustChangePassword ?? false,
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.adminUsers.push(u)
        return u
      },
      update: async ({ where, data }: any) => {
        await store.initSeed()
        const u = store.adminUsers.find((user) => user.id === where.id)
        if (u) Object.assign(u, data, { updatedAt: new Date() })
        return u
      },
    },

    adminSession: {
      findUnique: async ({ where }: any) => {
        await store.initSeed()
        const sess = store.adminSessions.find((s) => s.tokenHash === where.tokenHash)
        if (!sess) return null
        const user = store.adminUsers.find((u) => u.id === sess.userId)
        return {
          ...sess,
          user: user ?? null,
        }
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const sess: MockAdminSession = {
          id: 'sess_' + Date.now(),
          tokenHash: data.tokenHash,
          userId: data.userId,
          expiresAt: data.expiresAt instanceof Date ? data.expiresAt : new Date(data.expiresAt),
          ip: data.ip ?? null,
          userAgent: data.userAgent ?? null,
          createdAt: new Date(),
        }
        store.adminSessions.push(sess)
        return sess
      },
      delete: async ({ where }: any) => {
        await store.initSeed()
        const idx = store.adminSessions.findIndex((s) => s.tokenHash === where?.tokenHash || s.id === where?.id)
        if (idx !== -1) {
          return store.adminSessions.splice(idx, 1)[0]
        }
        return { id: where?.id }
      },
      deleteMany: async () => {
        await store.initSeed()
        const count = store.adminSessions.length
        store.adminSessions = []
        return { count }
      },
    },

    loginAttempt: {
      count: async () => {
        await store.initSeed()
        return 0
      },
      create: async ({ data }: any) => {
        await store.initSeed()
        const attempt = { id: 'la_' + Date.now(), ...data, createdAt: new Date() }
        store.loginAttempts.push(attempt)
        return attempt
      },
    },

    auditLog: {
      create: async ({ data }: any) => {
        await store.initSeed()
        const log: MockAuditLog = {
          id: 'aud_' + Date.now(),
          actorId: data.actorId ?? null,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId ?? null,
          meta: data.meta ?? null,
          ip: data.ip ?? null,
          createdAt: new Date(),
        }
        store.auditLogs.push(log)
        return log
      },
      findMany: async () => {
        await store.initSeed()
        return [...store.auditLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      },
      count: async () => {
        await store.initSeed()
        return store.auditLogs.length
      },
      groupBy: async () => {
        await store.initSeed()
        return []
      },
    },

    mediaAsset: {
      findUnique: async () => null,
      create: async ({ data }: any) => ({ id: 'media_' + Date.now(), ...data }),
      delete: async () => ({ id: 'media_deleted' }),
    },
  }

  return mock as any
}
