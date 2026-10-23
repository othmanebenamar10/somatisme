import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { phoneCountries } from '@/data/phoneCountries';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';

interface CountryPhoneInputProps {
  value: string;
  countryIso: string;
  onValueChange: (value: string) => void;
  onCountryIsoChange: (value: string) => void;
  id?: string;
  className?: string;
}

function flagFor(iso2: string): string {
  return Array.from(iso2.toUpperCase())
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('');
}

export default function CountryPhoneInput({
  value,
  countryIso,
  onValueChange,
  onCountryIsoChange,
  id = 'phone',
  className = '',
}: CountryPhoneInputProps) {
  const { language, t } = useLanguage();
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const selectedCountry = phoneCountries.find((country) => country.iso2 === countryIso) || phoneCountries[0];
  const countryNames = new Intl.DisplayNames([language], { type: 'region' });
  const getCountryName = (iso2: string, fallback: string) => countryNames.of(iso2.toUpperCase()) || fallback;
  const selectedCountryName = getCountryName(selectedCountry.iso2, selectedCountry.name);

  return (
    <div className={`flex min-w-0 ${className}`}>
      <label className="sr-only" htmlFor={`${id}-country`}>{t('phone.country.label')}</label>
      <Popover open={countryPickerOpen} onOpenChange={setCountryPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`${id}-country`}
            type="button"
            variant="outline"
            aria-label={t('phone.country.selected').replace('{country}', selectedCountryName).replace('{dialCode}', selectedCountry.dialCode)}
            aria-expanded={countryPickerOpen}
            className="h-12 w-[7.5rem] shrink-0 justify-between rounded-l-md rounded-r-none border-slate-300 bg-white px-3 text-slate-800 hover:bg-slate-50 sm:w-[9rem]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true">{flagFor(selectedCountry.iso2)}</span>
              <span className="truncate font-semibold">{selectedCountry.dialCode}</span>
            </span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-0">
          <Command>
            <CommandInput placeholder={t('phone.country.search')} />
            <CommandList className="max-h-[min(18rem,50dvh)]">
              <CommandEmpty>{t('phone.country.empty')}</CommandEmpty>
              {phoneCountries.map((country) => (
                <CommandItem
                  key={country.iso2}
                  value={`${getCountryName(country.iso2, country.name)} ${country.dialCode} ${country.iso2}`}
                  onSelect={() => {
                    onCountryIsoChange(country.iso2);
                    setCountryPickerOpen(false);
                  }}
                  className="min-h-10"
                >
                  <span aria-hidden="true">{flagFor(country.iso2)}</span>
                  <span className="min-w-0 flex-1 truncate">{getCountryName(country.iso2, country.name)}</span>
                  <span className="text-muted-foreground">{country.dialCode}</span>
                  <Check className={`ml-2 h-4 w-4 ${country.iso2 === countryIso ? 'opacity-100' : 'opacity-0'}`} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        id={id}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="6 12 34 56 78"
        className="h-12 min-w-0 flex-1 rounded-r-md border border-l-0 border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 focus:z-10 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
      />
    </div>
  );
}
