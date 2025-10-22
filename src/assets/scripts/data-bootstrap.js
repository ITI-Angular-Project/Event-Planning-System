// ====== Event Planning System LocalStorage Seeder (Normalized) ======
if (!localStorage.getItem('events')) {
  console.log('🚀 Initializing Event Planning System data...');
  // ---------- Encryption Helpers ----------
  function encryptText(text) {
    if (!text) return '';
    const reversed = text.split('').reverse().join('');
    let swapped = '';
    for (let i = 0; i < reversed.length; i += 2) {
      swapped += reversed[i + 1] ? reversed[i + 1] + reversed[i] : reversed[i];
    }
    let shifted = '';
    for (let c of swapped) shifted += String.fromCharCode(c.charCodeAt(0) + 3);
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + shifted + suffix;
  }

  function decryptText(text) {
    if (!text) return '';
    let inner = text.substring(1, text.length - 1);
    let shifted = '';
    for (let c of inner) shifted += String.fromCharCode(c.charCodeAt(0) - 3);
    let swapped = '';
    for (let i = 0; i < shifted.length; i += 2) {
      swapped += shifted[i + 1] ? shifted[i + 1] + shifted[i] : shifted[i];
    }
    return swapped.split('').reverse().join('');
  }

  // ---------- USERS ----------
  let users = JSON.parse(localStorage.getItem('users')) || [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@eps.com',
      role: 'admin',
      phone: '0100000000',
      password: encryptText('Admin123!'),
    },
    {
      id: 2,
      name: 'Organizer One',
      email: 'organizer1@eps.com',
      role: 'organizer',
      phone: '0100000001',
      password: encryptText('Organizer123!'),
    },
    {
      id: 3,
      name: 'Organizer Two',
      email: 'organizer2@eps.com',
      role: 'organizer',
      phone: '0100000002',
      password: encryptText('Organizer123!'),
    },
  ];

  // ---------- EVENTS ----------
  let events =
    JSON.parse(localStorage.getItem('events')) ||
    Array.from({ length: 180 }, (_, i) => {
      const category = ['wedding', 'conference', 'birthday', 'concert', 'workshop'][i % 5];
      const location = ['Cairo', 'Alex', 'Giza', 'Mansoura', 'Luxor'][i % 5];
      const categoryImages = {
        wedding:
          'https://img.freepik.com/free-photo/full-shot-happy-couple-with-flowers_23-2149956396.jpg?t=st=1760709544~exp=1760713144~hmac=6d8664ec4d0b320b2c13364ffaac9df6fcdeb22771faf473455307896d205b8f&w=1480',
        conference:
          'https://img.freepik.com/free-photo/people-taking-part-high-protocol-event_23-2150951249.jpg?t=st=1760709622~exp=1760713222~hmac=d97536cce3f4c1b967efe3c9e1149bd01e5254067d2f9e260f4030aa90d48606&w=1480',
        birthday: 'https://img.freepik.com/free-photo/delicious-birthday-cake-with-candles_23-2150734992.jpg?t=st=1760709663~exp=1760713263~hmac=a6396f69577795d70a03f4f6f4d8d8eb135c6ef242ab3990b1e6462bb50472f6&w=1480',
        concert: 'https://img.freepik.com/free-photo/glowing-stage-light-illuminates-cheering-rock-fans-generated-by-ai_188544-37983.jpg?t=st=1760709718~exp=1760713318~hmac=fa14c81ab2402242f2121e3df2cff58eed3ccfdd75d37943affaeb3ccc705697&w=1480',
        workshop: 'https://img.freepik.com/premium-photo/interview-round-table-discussion-business-convention-presentation-audience_561846-1659.jpg?w=1480',
      };
      const base = new Date(2025, 9, 10 + i);
      const startDate = base.toISOString().split('T')[0];
      const endDate = new Date(base.getTime() + 86400000).toISOString().split('T')[0];

      return {
        id: i + 1,
        name: `Event ${i + 1}`,
        description: `This is event ${i + 1} description.`,
        category: category,
        location: location,
        image: categoryImages[category],
        startDate: startDate,
        endDate: endDate,
        createdBy: (i % 2) + 2,
        guestIds: [],
        taskIds: [],
        expenseIds: [],
        feedbackIds: [],
        status: 'up-coming',
      };
    });

  // ---------- GUESTS ----------
  let guests = [];
  let guestId = 1;

  for (let ev of events) {
    const guestCount = Math.floor(Math.random() * 280) + 20; // between 20 and 300 guests
    const ids = [];

    for (let i = 0; i < guestCount; i++) {
      guests.push({
        id: guestId,
        eventId: ev.id,
        name: `Guest ${guestId}`,
        email: `guest${guestId}@eps.com`,
        phone: `0100${String(guestId).padStart(6, '0')}`,
        status: ['invited', 'accepted', 'declined', 'pending'][Math.floor(Math.random() * 4)],
        feedbackId: null,
      });
      ids.push(guestId);
      guestId++;
    }

    ev.guestIds = ids;
  }

  // ---------- TASKS ----------
  let tasks = [];
  let taskId = 1;

  for (let ev of events) {
    const taskCount = Math.floor(Math.random() * 8) + 3; // 3–10 tasks per event
    const ids = [];

    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        id: taskId,
        eventId: ev.id,
        title: `Task ${taskId}`,
        description: `Details for task ${taskId}`,
        assignedTo: ['Organizer One', 'Admin', 'Staff', 'Volunteer'][i % 4],
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        deadline: `2025-10-${12 + (i % 5)}`,
        status: ['not-started', 'in-progress', 'completed', 'cancelled'][
          Math.floor(Math.random() * 3)
        ],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      ids.push(taskId);
      taskId++;
    }

    ev.taskIds = ids;
  }

  // ---------- EXPENSES ----------
  let expenses = [];
  let expenseId = 1;

  for (let ev of events) {
    const expCount = Math.floor(Math.random() * 6) + 3; // 3–8 expenses per event
    const ids = [];

    for (let i = 0; i < expCount; i++) {
      expenses.push({
        id: expenseId,
        eventId: ev.id,
        name: ['Venue', 'Catering', 'Decor', 'Music', 'Transport', 'Photography'][i % 6],
        amount: Math.floor(Math.random() * 8000) + 1000,
        category: ['Venue', 'Food', 'Decoration', 'Music', 'Transport', 'Miscellaneous'][i % 6],
        date: `2025-10-${14 + (i % 10)}`,
        notes: 'Auto generated expense entry',
      });
      ids.push(expenseId);
      expenseId++;
    }

    ev.expenseIds = ids;
  }

  // ---------- FEEDBACK ----------
  let feedback = [];
  let feedbackId = 1;

  for (let ev of events) {
    const fCount = Math.floor(Math.random() * 30) + 5; // 5–35 feedback entries per event
    const ids = [];

    for (let i = 0; i < fCount; i++) {
      const g = guests.filter((g) => g.eventId === ev.id);
      const guest = g[Math.floor(Math.random() * g.length)];

      feedback.push({
        id: feedbackId,
        eventId: ev.id,
        guestId: guest ? guest.id : null,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Feedback ${feedbackId} from ${guest?.name || 'Guest'}`,
        createdAt: new Date().toISOString(),
      });

      if (guest) guest.feedbackId = feedbackId;
      ids.push(feedbackId);
      feedbackId++;
    }

    ev.feedbackIds = ids;
  }

  // ---------- SETTINGS ----------
  let settings = JSON.parse(localStorage.getItem('settings')) || {
    theme: 'light',
    language: 'en',
    notifications: true,
  };

  // ---------- DASHBOARD SUMMARY ----------
  function calculateDashboardStats() {
    const totalEvents = events.length;
    const completed = events.filter((e) => e.status === 'completed').length;
    const upcoming = events.filter((e) => e.status === 'up-coming').length;
    const totalGuests = guests.length;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgFeedback =
      feedback.length > 0
        ? (feedback.reduce((a, b) => a + b.rating, 0) / feedback.length).toFixed(1)
        : 0;
    return { totalEvents, completed, upcoming, totalGuests, totalExpenses, avgFeedback };
  }

  let dashboard = calculateDashboardStats();

  // ---------- AUTO UPDATE STATUS ----------
  events = events.map((ev) => {
    const today = new Date();
    const start = new Date(ev.startDate);
    const end = new Date(ev.endDate);
    if (today < start) ev.status = 'up-coming';
    else if (today >= start && today <= end) ev.status = 'in-progress';
    else ev.status = 'completed';
    return ev;
  });

  // ---------- SAVE ALL ----------
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('events', JSON.stringify(events));
  localStorage.setItem('guests', JSON.stringify(guests));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('feedback', JSON.stringify(feedback));
  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('dashboard', JSON.stringify(dashboard));

  console.log('✅ Event Planning System data initialized successfully.');
} else {
  console.log('✅ Data already exists — skipping seeding.');
}
