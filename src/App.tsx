/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Game from './components/Game';
import { LanguageProvider } from './LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <Game />
    </LanguageProvider>
  );
}
