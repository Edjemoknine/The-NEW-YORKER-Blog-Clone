import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
type Props = {
  term: string;
  setTerm: (term: string) => void;
};
const SearchForm = ({ term, setTerm }: Props) => {
  return (
    <>
      <div className="flex place-items-center max-w-3xl mx-auto mb-10">
        <div className="w-full relative">
          <Search
            className="absolute font-bold text-neutral-600 top-1/2 -translate-y-1/2 left-3"
            size={18}
          />
          <Input
            placeholder="Enter search terms"
            className="rounded-none md:py-6 py-4 pl-10 focus-visible:ring-0  outline-none ring-0 "
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <Button className="rounded-none text-sm font-semibold md:py-6 py-3  px-10  ">
          Search
        </Button>
      </div>
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto ">
        <p className="font-grotesk font-medium">3,515 stories about {term}</p>
        <div className="flex items-center gap-3">
          <p className="font-grotesk font-medium">Sorted by</p>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Relevance</SelectItem>
                <SelectItem value="banana">Newest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default SearchForm;
