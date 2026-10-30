/**
 * Idea 10's page text and sources live with its guided scenarios in followup-content.ts,
 * because the scenario narration cites the same numbered sources. This re-export keeps one
 * source of truth for every module that reads src/ideas/data.
 */
export { followupIdea as idea } from '../followup-content';
