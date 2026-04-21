const BASE = "https://quickconnect-zc28.onrender.com";

export const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

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