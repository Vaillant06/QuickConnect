const BASE = "http://127.0.0.1:8000";

export const fetchNeeds = () =>
  fetch(`${BASE}/needs`).then(res => res.json());

export const fetchVolunteers = () =>
  fetch(`${BASE}/volunteers`).then(res => res.json());

export const fetchAssignments = () =>
  fetch(`${BASE}/assignments`).then(res => res.json());

export const matchNeed = (id) =>
  fetch(`${BASE}/match/${id}`, { method: "POST" });

export const acceptAssignment = (id) =>
  fetch(`${BASE}/accept/${id}`, { method: "POST" });