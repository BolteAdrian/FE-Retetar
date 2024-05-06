import { ILanguageSwitcher } from 'src/app/models/ILanguageSwitcher';

export const unit: string[] = ['g', 'Kg', 'L', 'ml', 'Buc.'];
export const currency: string[] = ['RON', 'EUR', 'GBP', 'USD'];
export const languages: ILanguageSwitcher[] = [
  { code: 'EN', name: 'English', flagUrl: 'path_to_flag_image' },
  { code: 'RO', name: 'Romanian', flagUrl: 'path_to_flag_image' },
  // { code: 'DE', name: 'German', flagUrl: 'path_to_flag_image' },
  // { code: 'FR', name: 'French', flagUrl: 'path_to_flag_image' },
  // { code: 'ES', name: 'Spanish', flagUrl: 'path_to_flag_image' },
  // { code: 'PT', name: 'Portuguese', flagUrl: 'path_to_flag_image' },
  // { code: 'HU', name: 'Hungarian', flagUrl: 'path_to_flag_image' },
];
