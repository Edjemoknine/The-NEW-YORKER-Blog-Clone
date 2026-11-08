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
      <div className="mx-auto mb-8 flex max-w-3xl items-center">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search stories"
            aria-label="Search stories"
            className="h-12 rounded-r-none border-r-0 bg-card pl-10"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <Button className="h-12 rounded-l-none px-7 text-sm font-semibold">
          Search
        </Button>
      </div>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 text-sm">
        <p className="text-muted-foreground">
          {term ? `Stories about ${term}` : "Search the latest stories"}
        </p>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground">Sort by</p>
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
