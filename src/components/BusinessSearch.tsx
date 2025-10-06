import { useState, useEffect } from "react";
import { Search, Star, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BusinessResult {
  id: string;
  name: string;
  category: string | null;
  logo_url: string | null;
  rating: number;
  review_count: number;
}

export const BusinessSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchBusinesses = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc("search_businesses", {
          search_query: searchQuery.trim(),
          result_limit: 6,
        });

        if (error) throw error;
        setResults(data || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchBusinesses, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectBusiness = (businessId: string) => {
    navigate(`/business/${businessId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search businesses by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          className="pl-10 pr-4 py-6 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 transition-all"
        />
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2"
          >
            <Card className="overflow-hidden shadow-2xl border-2 border-purple-100">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.map((business, index) => (
                    <motion.button
                      key={business.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectBusiness(business.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                    >
                      <div className="flex-shrink-0">
                        {business.logo_url ? (
                          <img
                            src={business.logo_url}
                            alt={business.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {business.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {business.category || "Business"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {business.rating > 0 ? business.rating.toFixed(1) : "New"}
                        </span>
                        <span className="text-gray-400 ml-1">
                          ({business.review_count})
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No businesses found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close results */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};
