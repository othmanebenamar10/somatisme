/** ISO 3166-1 regions and their ITU international calling codes. */
const countryRows = `
AF|Afghanistan|93
AL|Albanie|355
DZ|Algérie|213
AS|Samoa américaines|1
AD|Andorre|376
AO|Angola|244
AI|Anguilla|1
AG|Antigua-et-Barbuda|1
AR|Argentine|54
AM|Arménie|374
AW|Aruba|297
AU|Australie|61
AT|Autriche|43
AZ|Azerbaïdjan|994
BS|Bahamas|1
BH|Bahreïn|973
BD|Bangladesh|880
BB|Barbade|1
BY|Biélorussie|375
BE|Belgique|32
BZ|Belize|501
BJ|Bénin|229
BM|Bermudes|1
BT|Bhoutan|975
BO|Bolivie|591
BA|Bosnie-Herzégovine|387
BW|Botswana|267
BR|Brésil|55
IO|Territoire britannique de l’océan Indien|246
VG|Îles Vierges britanniques|1
BN|Brunei|673
BG|Bulgarie|359
BF|Burkina Faso|226
BI|Burundi|257
KH|Cambodge|855
CM|Cameroun|237
CA|Canada|1
CV|Cap-Vert|238
KY|Îles Caïmans|1
CF|République centrafricaine|236
TD|Tchad|235
CL|Chili|56
CN|Chine|86
CX|Île Christmas|61
CC|Îles Cocos|61
CO|Colombie|57
KM|Comores|269
CG|République du Congo|242
CD|République démocratique du Congo|243
CK|Îles Cook|682
CR|Costa Rica|506
CI|Côte d’Ivoire|225
HR|Croatie|385
CU|Cuba|53
CW|Curaçao|599
CY|Chypre|357
CZ|Tchéquie|420
DK|Danemark|45
DJ|Djibouti|253
DM|Dominique|1
DO|République dominicaine|1
EC|Équateur|593
EG|Égypte|20
SV|Salvador|503
GQ|Guinée équatoriale|240
ER|Érythrée|291
EE|Estonie|372
SZ|Eswatini|268
ET|Éthiopie|251
FK|Îles Malouines|500
FO|Îles Féroé|298
FJ|Fidji|679
FI|Finlande|358
FR|France|33
GF|Guyane française|594
PF|Polynésie française|689
GA|Gabon|241
GM|Gambie|220
GE|Géorgie|995
DE|Allemagne|49
GH|Ghana|233
GI|Gibraltar|350
GR|Grèce|30
GL|Groenland|299
GD|Grenade|1
GP|Guadeloupe|590
GU|Guam|1
GT|Guatemala|502
GG|Guernesey|44
GN|Guinée|224
GW|Guinée-Bissau|245
GY|Guyana|592
HT|Haïti|509
HN|Honduras|504
HK|Hong Kong|852
HU|Hongrie|36
IS|Islande|354
IN|Inde|91
ID|Indonésie|62
IR|Iran|98
IQ|Irak|964
IE|Irlande|353
IM|Île de Man|44
IL|Israël|972
IT|Italie|39
JM|Jamaïque|1
JP|Japon|81
JE|Jersey|44
JO|Jordanie|962
KZ|Kazakhstan|7
KE|Kenya|254
KI|Kiribati|686
XK|Kosovo|383
KW|Koweït|965
KG|Kirghizistan|996
LA|Laos|856
LV|Lettonie|371
LB|Liban|961
LS|Lesotho|266
LR|Liberia|231
LY|Libye|218
LI|Liechtenstein|423
LT|Lituanie|370
LU|Luxembourg|352
MO|Macao|853
MG|Madagascar|261
MW|Malawi|265
MY|Malaisie|60
MV|Maldives|960
ML|Mali|223
MT|Malte|356
MH|Îles Marshall|692
MQ|Martinique|596
MR|Mauritanie|222
MU|Maurice|230
YT|Mayotte|262
MX|Mexique|52
FM|Micronésie|691
MD|Moldavie|373
MC|Monaco|377
MN|Mongolie|976
ME|Monténégro|382
MS|Montserrat|1
MA|Maroc|212
MZ|Mozambique|258
MM|Myanmar|95
NA|Namibie|264
NR|Nauru|674
NP|Népal|977
NL|Pays-Bas|31
NC|Nouvelle-Calédonie|687
NZ|Nouvelle-Zélande|64
NI|Nicaragua|505
NE|Niger|227
NG|Nigeria|234
NU|Niue|683
NF|Île Norfolk|672
KP|Corée du Nord|850
MK|Macédoine du Nord|389
MP|Îles Mariannes du Nord|1
NO|Norvège|47
OM|Oman|968
PK|Pakistan|92
PW|Palaos|680
PS|Palestine|970
PA|Panama|507
PG|Papouasie-Nouvelle-Guinée|675
PY|Paraguay|595
PE|Pérou|51
PH|Philippines|63
PL|Pologne|48
PT|Portugal|351
PR|Porto Rico|1
QA|Qatar|974
RE|La Réunion|262
RO|Roumanie|40
RU|Russie|7
RW|Rwanda|250
BL|Saint-Barthélemy|590
SH|Sainte-Hélène|290
KN|Saint-Christophe-et-Niévès|1
LC|Sainte-Lucie|1
MF|Saint-Martin|590
PM|Saint-Pierre-et-Miquelon|508
VC|Saint-Vincent-et-les-Grenadines|1
WS|Samoa|685
SM|Saint-Marin|378
ST|Sao Tomé-et-Principe|239
SA|Arabie saoudite|966
SN|Sénégal|221
RS|Serbie|381
SC|Seychelles|248
SL|Sierra Leone|232
SG|Singapour|65
SX|Saint-Martin (partie néerlandaise)|1
SK|Slovaquie|421
SI|Slovénie|386
SB|Îles Salomon|677
SO|Somalie|252
ZA|Afrique du Sud|27
KR|Corée du Sud|82
SS|Soudan du Sud|211
ES|Espagne|34
LK|Sri Lanka|94
SD|Soudan|249
SR|Suriname|597
SJ|Svalbard et Jan Mayen|47
SE|Suède|46
CH|Suisse|41
SY|Syrie|963
TW|Taïwan|886
TJ|Tadjikistan|992
TZ|Tanzanie|255
TH|Thaïlande|66
TL|Timor oriental|670
TG|Togo|228
TK|Tokelau|690
TO|Tonga|676
TT|Trinité-et-Tobago|1
TN|Tunisie|216
TR|Turquie|90
TM|Turkménistan|993
TC|Îles Turques-et-Caïques|1
TV|Tuvalu|688
VI|Îles Vierges américaines|1
UG|Ouganda|256
UA|Ukraine|380
AE|Émirats arabes unis|971
GB|Royaume-Uni|44
US|États-Unis|1
UY|Uruguay|598
UZ|Ouzbékistan|998
VU|Vanuatu|678
VA|Vatican|39
VE|Venezuela|58
VN|Viêt Nam|84
WF|Wallis-et-Futuna|681
EH|Sahara occidental|212
YE|Yémen|967
ZM|Zambie|260
ZW|Zimbabwe|263
AX|Îles Åland|358
`.trim();

export interface PhoneCountry {
  iso2: string;
  name: string;
  dialCode: string;
}

export const phoneCountries: PhoneCountry[] = countryRows
  .split('\n')
  .map((row) => {
    const [iso2, name, dialCode] = row.split('|');
    return { iso2, name, dialCode: `+${dialCode}` };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

export function toInternationalPhone(countryIsoOrDialCode: string, localNumber: string): string {
  const dialCode = countryIsoOrDialCode.startsWith('+')
    ? countryIsoOrDialCode
    : phoneCountries.find((country) => country.iso2 === countryIsoOrDialCode)?.dialCode || '+212';
  const countryDigits = dialCode.slice(1);
  let digits = localNumber.replace(/\D/g, '');
  if (digits.startsWith(countryDigits) && digits.length > countryDigits.length + 6) {
    digits = digits.slice(countryDigits.length);
  }
  digits = digits.replace(/^0+/, '');
  return digits ? `${dialCode}${digits}` : '';
}
