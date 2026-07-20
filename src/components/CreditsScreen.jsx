import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fixOrphans } from "../utils/orphans.js";
import LanguageToggle from "./LanguageToggle.jsx";
import PixelButton from "./PixelButton.jsx";

// Link zewnętrzny otwierany w nowej karcie (bezpiecznie: noopener/noreferrer).
function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function CreditsPl() {
  return (
    <>
      <h1>Cześć!</h1>

      <p>
        <strong>
          <em>Ogr!</em>
        </strong>{" "}
        jest uproszczoną adaptacją gry stworzonej przez{" "}
        <Ext href="https://troypress.com/">TroyPress</Ext> — J. Alana Henninga.
      </p>

      <p>
        Na potrzeby tego projektu uprościłem poszczególne mechaniki, aby całość
        mogła w pełni funkcjonować jako gra paragrafowa. W związku z tym z gry
        zniknęły między innymi rzuty kośćmi, ekwipunek oraz statystyki.
      </p>

      <p>
        Jest to moje pierwsze podejście do stworzenia gry paragrafowej,
        przetłumaczenia orginalnego tekstu z języka angielskiego na język polski
        oraz zaimplementowania całości w formie aplikacji webowej.
      </p>

      <p>
        Mam nadzieję, że ta krótka przygoda okaże się dla Ciebie równie świetną
        zabawą, jak dla mnie było jej tworzenie.
      </p>

      <p>
        Pixelartowa grafika ogra widoczna w interfejsie została stworzona za
        pomocą narzędzia <Ext href="https://wigglypaint.com/">WigglyPaint</Ext>.
      </p>

      <p>
        W projekcie wykorzystano poniższe utwory muzyczne, fonty oraz ikony:
      </p>

      <h2>Ikony</h2>
      <ul>
        <li>
          <strong>Pixel Icon Library</strong> — biblioteka ikon stworzona przez{" "}
          <Ext href="https://pixeliconlibrary.com/">HackerNoon</Ext>.
          Udostępniona na licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </Ext>
          .
        </li>
      </ul>

      <h2>Tekst i fabuła</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://troypress.itch.io/suddenly-an-ogre-a-dw-gamebook">
              Suddenly an Ogre
            </Ext>
          </strong>{" "}
          — interaktywny gamebook stworzony przez{" "}
          <Ext href="https://troypress.com/">TroyPress</Ext> — J. Alana
          Henninga. Udostępniony na licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </Ext>
          .
        </li>
      </ul>

      <h2>Fonty</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://departuremono.com/">Departure Mono</Ext>
          </strong>{" "}
          — font zaprojektowany przez{" "}
          <Ext href="https://www.helenazhang.com/">Helenę Zhang</Ext>.
          Udostępniony na licencji{" "}
          <Ext href="https://openfontlicense.org/open-font-license-official-text/">
            SIL Open Font License 1.1
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://doublegumm.itch.io/daydream-pixel-font">
              Daydream Demo
            </Ext>
          </strong>{" "}
          — font stworzony przez{" "}
          <Ext href="https://linktr.ee/doublegum">DoubleGum</Ext>. Wykorzystany
          na warunkach indywidualnej licencji dostarczonej przez autora.
        </li>
      </ul>

      <h2>Muzyka</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/farewell-my-friend">
              Farewell My Friend
            </Ext>
          </strong>{" "}
          — utwór skomponowany przez{" "}
          <Ext href="https://opengameart.org/users/onemansymphony">
            One Man Symphony
          </Ext>
          . Udostępniony na licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/orchestral-battle-music">
              Orchestral Battle Music
            </Ext>
          </strong>{" "}
          — utwór skomponowany przez Johana Jansena, występującego pod nazwą{" "}
          <Ext href="https://opengameart.org/users/zefz">Zefz</Ext>.
          Wykorzystany w projekcie na warunkach licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/creepy-forest-f">
              Creepy Forest (F)
            </Ext>
          </strong>{" "}
          — utwór stworzony przez Augmentality, czyli Brandona Morrisa, i
          opublikowany w serwisie OpenGameArt przez użytkownika{" "}
          <Ext href="https://opengameart.org/users/haeldb">HaelDB</Ext>.
          Udostępniony na zasadach{" "}
          <Ext href="https://creativecommons.org/publicdomain/zero/1.0/">
            CC0 1.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/haunted-woods-horror-drone">
              Haunted Woods (Horror Drone)
            </Ext>
          </strong>{" "}
          — utwór skomponowany przez{" "}
          <Ext href="https://opengameart.org/users/michael-klier">
            Michaela Kliera
          </Ext>
          . Udostępniony na licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/dark-ambiance-cries-from-hell">
              Dark Ambiance — Cries From Hell
            </Ext>
          </strong>{" "}
          — utwór skomponowany przez Jesúsa Lastrę, występującego również pod
          nazwą{" "}
          <Ext href="https://opengameart.org/users/jalastram">jalastram</Ext>.
          Udostępniony na licencji{" "}
          <Ext href="https://creativecommons.org/licenses/by/3.0/">
            CC BY 3.0
          </Ext>
          .
        </li>
      </ul>

      <p>
        Wymienieni autorzy nie są powiązani z twórcą tej aplikacji, a
        wykorzystanie ich materiałów nie oznacza, że popierają oni ten projekt
        ani są z nim w jakikolwiek sposób związani.
      </p>
    </>
  );
}

function CreditsEn() {
  return (
    <>
      <h1>Hello!</h1>

      <p>
        <strong>
          <em>Ogre!</em>
        </strong>{" "}
        is a simplified adaptation of a game created by{" "}
        <Ext href="https://troypress.com/">TroyPress</Ext> — J. Alan Henning.
      </p>

      <p>
        For the purposes of this project, I simplified some of the original
        mechanics so that the whole experience could function entirely as a
        gamebook. As a result, mechanics such as dice rolls, inventory, and
        character statistics were removed.
      </p>

      <p>
        This is my first attempt at creating a gamebook, translating the
        original text from English into Polish, and implementing the entire
        project as a web application.
      </p>

      <p>
        I hope this short adventure will be as enjoyable for you to play as it
        was for me to create.
      </p>

      <p>
        The pixel-art ogre featured in the interface was created using{" "}
        <Ext href="https://wigglypaint.com/">WigglyPaint</Ext>.
      </p>

      <p>
        The following music tracks, fonts, and icons were used in this project:
      </p>

      <h2>Icons</h2>
      <ul>
        <li>
          <strong>Pixel Icon Library</strong> — an icon library created by{" "}
          <Ext href="https://pixeliconlibrary.com/">HackerNoon</Ext>. Licensed
          under{" "}
          <Ext href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </Ext>
          .
        </li>
      </ul>

      <h2>Text and Story</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://troypress.itch.io/suddenly-an-ogre-a-dw-gamebook">
              Suddenly an Ogre
            </Ext>
          </strong>{" "}
          — an interactive gamebook created by{" "}
          <Ext href="https://troypress.com/">TroyPress</Ext> — J. Alan Henning.
          Licensed under{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </Ext>
          .
        </li>
      </ul>

      <h2>Fonts</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://departuremono.com/">Departure Mono</Ext>
          </strong>{" "}
          — a font designed by{" "}
          <Ext href="https://www.helenazhang.com/">Helena Zhang</Ext>. Licensed
          under the{" "}
          <Ext href="https://openfontlicense.org/open-font-license-official-text/">
            SIL Open Font License 1.1
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://doublegumm.itch.io/daydream-pixel-font">
              Daydream Demo
            </Ext>
          </strong>{" "}
          — a font created by{" "}
          <Ext href="https://linktr.ee/doublegum">DoubleGum</Ext>. Used under
          the terms of the individual license provided by the creator.
        </li>
      </ul>

      <h2>Music</h2>
      <ul>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/farewell-my-friend">
              Farewell My Friend
            </Ext>
          </strong>{" "}
          — composed by{" "}
          <Ext href="https://opengameart.org/users/onemansymphony">
            One Man Symphony
          </Ext>
          . Licensed under{" "}
          <Ext href="https://creativecommons.org/licenses/by/4.0/">
            CC BY 4.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/orchestral-battle-music">
              Orchestral Battle Music
            </Ext>
          </strong>{" "}
          — composed by Johan Jansen, also known as{" "}
          <Ext href="https://opengameart.org/users/zefz">Zefz</Ext>. Used under
          the terms of the{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </Ext>{" "}
          license.
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/creepy-forest-f">
              Creepy Forest (F)
            </Ext>
          </strong>{" "}
          — created by Augmentality, also known as Brandon Morris, and published
          on OpenGameArt by{" "}
          <Ext href="https://opengameart.org/users/haeldb">HaelDB</Ext>.
          Released under{" "}
          <Ext href="https://creativecommons.org/publicdomain/zero/1.0/">
            CC0 1.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/haunted-woods-horror-drone">
              Haunted Woods (Horror Drone)
            </Ext>
          </strong>{" "}
          — composed by{" "}
          <Ext href="https://opengameart.org/users/michael-klier">
            Michael Klier
          </Ext>
          . Licensed under{" "}
          <Ext href="https://creativecommons.org/licenses/by-sa/3.0/">
            CC BY-SA 3.0
          </Ext>
          .
        </li>
        <li>
          <strong>
            <Ext href="https://opengameart.org/content/dark-ambiance-cries-from-hell">
              Dark Ambiance — Cries From Hell
            </Ext>
          </strong>{" "}
          — composed by Jesús Lastra, also known as{" "}
          <Ext href="https://opengameart.org/users/jalastram">jalastram</Ext>.
          Licensed under{" "}
          <Ext href="https://creativecommons.org/licenses/by/3.0/">
            CC BY 3.0
          </Ext>
          .
        </li>
      </ul>

      <p>
        The creators listed above are not affiliated with the creator of this
        application. The use of their work does not imply that they endorse,
        support, or are otherwise associated with this project.
      </p>
    </>
  );
}

// Ekran "Autorzy" / "Credits": pełnoekranowa, przewijalna treść (align left).
// Widoczny jest wyłącznie przełącznik języka; na dole wyśrodkowany przycisk powrotu.
export default function CreditsScreen({ onToggleLanguage, onBack }) {
  const { t, i18n } = useTranslation();
  const isPl = i18n.language?.startsWith("pl");
  const contentRef = useRef(null);

  // Statyczna treść (JSX) w wersji polskiej: wstaw niełamliwe spacje po
  // jednoliterowych spójnikach bezpośrednio w węzłach tekstowych DOM.
  useEffect(() => {
    if (!isPl || !contentRef.current) return;
    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
    );
    let node = walker.nextNode();
    while (node) {
      const fixed = fixOrphans(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
      node = walker.nextNode();
    }
  }, [isPl]);

  return (
    <main className="credits-screen">
      <div className="top-bar">
        <LanguageToggle onToggle={onToggleLanguage} />
      </div>

      <div className="credits-scroll">
        <div className="credits-content" ref={contentRef}>
          {isPl ? <CreditsPl /> : <CreditsEn />}
        </div>
        <div className="credits-actions">
          <PixelButton onClick={onBack}>{t("back")}</PixelButton>
        </div>
      </div>
    </main>
  );
}
