type RecipeLike<VariantName extends string> = {
  classNames: { variants: Record<VariantName, Record<string, string>> };
};

type SelectArgType = { control: 'select'; options: string[] };

/**
 * vanilla-extract recipe의 variant로 Storybook argTypes(select 컨트롤)를 만든다.
 * recipe에 variant를 추가하거나 바꾸면 Story 컨트롤도 함께 바뀐다.
 */
export function recipeArgTypes<VariantName extends string>(
  recipeFn: RecipeLike<VariantName>,
) {
  const variants: Record<string, Record<string, string>> = recipeFn.classNames
    .variants;

  return Object.fromEntries(
    Object.entries(variants).map(([name, options]) => [
      name,
      { control: 'select', options: Object.keys(options) },
    ]),
  ) as Record<VariantName, SelectArgType>;
}
