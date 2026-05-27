import { Settings } from './settings.model';
import { TSettings } from './settings.interface';

const getSettings = async () => (await Settings.findOne().lean()) ?? {};
const updateSettings = async (payload: Partial<TSettings>) => Settings.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();

export const SettingsServices = { getSettings, updateSettings };
