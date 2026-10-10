import { phoneCountries } from '@/data/phoneCountries';

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
  return (
    <div className={`flex min-w-0 ${className}`}>
      <label className="sr-only" htmlFor={`${id}-country`}>Pays et indicatif téléphonique</label>
      <select
        id={`${id}-country`}
        value={countryIso}
        onChange={(event) => onCountryIsoChange(event.target.value)}
        className="max-w-[46%] rounded-l-md border border-r-0 border-slate-300 bg-white px-2 text-sm text-slate-800 focus:z-10 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 sm:max-w-[52%]"
      >
        {phoneCountries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {flagFor(country.iso2)} {country.name} ({country.dialCode})
          </option>
        ))}
      </select>
      <input
        id={id}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="6 12 34 56 78"
        className="h-12 min-w-0 flex-1 rounded-r-md border border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
      />
    </div>
  );
}
