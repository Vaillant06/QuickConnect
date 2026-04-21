from app.utils.distance import calculate_distance

def match_volunteers_logic(need, volunteers):
    scored_volunteers = {}

    for v in volunteers:
        score = 0
        distance = None

        if v.availability == "available":
            score += 50

        if need.category and v.skills:
            skills_list = [s.strip() for s in v.skills.lower().split(",")]
            if need.category.lower() in skills_list:
                score += 30

        if need.latitude and v.latitude:
            distance = calculate_distance(
                need.latitude, need.longitude,
                v.latitude, v.longitude
            )

            if distance < 5:
                score += 20
            elif distance < 10:
                score += 10
            else:
                score += 5

        if score > 0:
            scored_volunteers[v.id] = {
                "volunteer": v,
                "score": score,
                "distance": distance or 999
            }
        elif score > 100:
            scored_volunteers[v.id] = {
                "volunteer": v,
                "score": 100,
                "distance": distance or 999
            }

    return sorted(
        scored_volunteers.values(),
        key=lambda x: (-x["score"], x["distance"])
    )