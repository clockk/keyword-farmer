import { specialKeywords, ko, en } from './assets';

interface Option {
  lang?: 'en' | 'kr'
  loop?: boolean
  length?: number | { min?: number, max?: number }
  excludeSpaces?: boolean
  specialKeywords?: 'only' | 'mixed' | 'combine'
}

const useKeywordFarm = (option?: Option) => {
  const originKeywords = option?.lang === 'kr'
    ? ko
    : en;
  const currentKeyword = option === undefined
    ? originKeywords
    : option?.specialKeywords === 'only'
      ? specialKeywords
      : originKeywords.reduce<string[]>((previous, current) => {
        let targetKeyword = '';

        // option.keywordLength case
        if (option.length !== undefined) {
          if (typeof option.length === 'object') {
            if ((current.length >= (option.length?.min ?? 1)) && (current.length <= (option.length.max ?? Infinity))) {
              targetKeyword = current;
            }
          } else if (typeof option.length === 'number') {
            if (current.length === option.length) {
              targetKeyword = current;
            }
          } else {
            // TODO: error
          }
        } else {
          targetKeyword = current;
        }

        // option.excludeSpaces case
        if (option.excludeSpaces ?? false) {
          current = current.replaceAll(' ', '');
        }

        previous.push(targetKeyword);
        return previous;
      }, []);

  const keywords: string[] = option?.specialKeywords === 'mixed'
    ? [...currentKeyword, ...specialKeywords]
    : currentKeyword;

  const create = (count?: number) => {
    return count !== undefined
      ? new Array(count)
        .fill(false)
        .map(() => keywords[Math.floor(Math.random() * keywords.length)])
      : keywords[Math.floor(Math.random() * keywords.length)];
  };

  return { create, keywords };
};

const { create } = useKeywordFarm({
  lang: 'kr',
  specialKeywords: 'combine'
});

for (let i = 0; i < 10; i++) {
  console.log(create());
}

export { useKeywordFarm, specialKeywords };
