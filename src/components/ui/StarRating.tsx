import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  reviews?: number;
};

export default function StarRating({ rating, reviews }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-border"
            }`}
          />
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-sm text-lighter">({reviews})</span>
      )}
    </div>
  );
}
