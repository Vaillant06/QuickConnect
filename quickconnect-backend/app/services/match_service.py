from app.utils.distance import calculate_distance
import math

def normalize_distance(distance):
    return math.exp(-distance / 10)  


def skill_match_score(need_category, volunteer_skills):
    if not need_category or not volunteer_skills:
        return 0

    skills_list = [s.strip() for s in volunteer_skills.lower().split(",")]

    matches = [s for s in skills_list if need_category.lower() in s]
    return len(matches) / len(skills_list) if skills_list else 0


def match_volunteers_logic(need, volunteers):
    scored_volunteers = []

    for v in volunteers:
        distance = None

        availability_score = 1 if v.availability == "available" else 0

        if need.latitude and v.latitude:
            distance = calculate_distance(
                need.latitude, need.longitude,
                v.latitude, v.longitude
            )
            distance_score = normalize_distance(distance)
        else:
            distance_score = 0

        skill_score = skill_match_score(need.category, v.skills)

        final_score = (
            0.4 * availability_score +
            0.3 * distance_score +
            0.3 * skill_score
        )

        if final_score > 0:
            scored_volunteers.append({
                "volunteer": v,
                "score": round(final_score * 100, 2),
                "distance": distance or 999
            })

    return sorted(
        scored_volunteers,
        key=lambda x: (-x["score"], x["distance"])
    )