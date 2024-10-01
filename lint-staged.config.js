export default {
  '**/*.{js,jsx,ts,tsx}': stagedFiles => [
    'npm run typecheck',
    `eslint --fix ${stagedFiles.join(' ')}`,
    `prettier --write ${stagedFiles.join(' ')}`,
  ],
}
