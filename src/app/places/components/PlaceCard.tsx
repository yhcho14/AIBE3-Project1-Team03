import { useRouter } from 'next/navigation'
import { Place } from '../../../lib/types/place'
import AddToTripButton from './AddToTripButton'

interface PlaceCardProps {
    place: Place
    filterCategory: string
    PLACE_CONTENT_TYPE_MAP: Map<string, string>
    hoveredPlaceId: string | null
    onAddToTrip?: (placeId: string) => void
    setHoveredPlaceId: (id: string | null) => void
}

export default function PlaceCard({
    place,
    filterCategory,
    PLACE_CONTENT_TYPE_MAP,
    hoveredPlaceId,
    onAddToTrip,
    setHoveredPlaceId,
}: PlaceCardProps) {
    const router = useRouter()

    return (
        <div
            key={place.contentid}
            onClick={() => router.push(`/places/${place.contentid}`)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="relative h-48">
                {place.firstimage ? (
                    <img src={place.firstimage} alt={place.title} className="w-full h-full object-cover object-top" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <i className="ri-image-2-line text-gray-400 text-2xl"></i>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    {place.contenttypeid && filterCategory === '' && (
                        <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs">
                            {PLACE_CONTENT_TYPE_MAP.get(place.contenttypeid) || ''}
                        </span>
                    )}
                </div>

                <AddToTripButton
                    hovered={hoveredPlaceId === place.contentid}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onAddToTrip) onAddToTrip(place.contentid)
                    }}
                    onMouseEnter={() => setHoveredPlaceId(place.contentid)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                />
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{place.title}</h3>
                </div>

                {place.addr1 && (
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <i className="ri-map-pin-line text-gray-400"></i>
                        <span>{place.addr1}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
