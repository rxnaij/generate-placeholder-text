import { placeholderText } from "./text"

const defaultFont = {
  family: 'Roboto',
  style: 'Regular'
}

/**
 * Apply a default text style to a text node.
 * Remember to only call this inside a Promise when 
 * @param node the TextNode to apply text styles to
 * @param text a string of text content
 * @param resize whether a default size should be applied to the text
 */
function setDefaultTextStyles(node: TextNode, text: string, resize?: boolean) {
  node.fontName = defaultFont
  if (resize) {
    node.resize(250, 285)
  }
  node.textAutoResize = "TRUNCATE"
  node.fontSize = 16
  node.characters = text
}

function main() {
  // Get the currently selected node, or if multiple nodes are selected, the first node.
  // NOTE: the order of nodes in the selection is *unspecified*.
  // In this context, selection[0] could potentially be any of the selected nodes.
  // See: https://www.figma.com/plugin-docs/api/properties/PageNode-selection/
  const currentSelection = figma.currentPage.selection[0]

  if (!currentSelection) {    // If nothing is selected, create a new textbox with placeholder text.
    Promise.resolve(
      // Load the font.
      figma.loadFontAsync(defaultFont)
    )
      .then(() => {
        // Create the text box.
        const node = figma.createText()

        // Position the text in the center of the viewport.
        node.x = figma.viewport.center.x
        node.y = figma.viewport.center.y

        // Customize the appearance of the text box.
        setDefaultTextStyles(node, placeholderText, true)

        // Shift focus to the newly created text box.
        figma.currentPage.selection = [node]
      })
      .then(() => {
        figma.closePlugin()
        return
      })
  } else if (currentSelection.type === 'TEXT') {    // If a textbox is selected, replace its content with placeholder text
    if (!currentSelection.hasMissingFont) { // Check if all fonts are loaded.
      Promise.all(
        // If there's more than one font, load all of them. (Only the first font will be used for applying styles)
        currentSelection.fontName === figma.mixed
          ? currentSelection.getRangeAllFontNames(0, currentSelection.characters.length).map(figma.loadFontAsync)
          : [figma.loadFontAsync(currentSelection.fontName)]
      )
        .catch(() => {
          throw new Error(`Could not load font.`)
        })
        .then(() => {
          currentSelection.characters = placeholderText
          if (currentSelection.textAutoResize === "NONE") {
            currentSelection.textAutoResize = "TRUNCATE"
          }
        })
        .catch(error => {   // Throw an error if any of the textbox's fonts are missing.
          console.error(error)
          throw new Error(`Error: Could not load fonts`)
        })
        .then(() => {
          figma.closePlugin()
          return
        })
    }
  } else {    // If any other element is selected, create a new textbox above that element.
    Promise.resolve(
      // Load the font.
      figma.loadFontAsync(defaultFont)
    )
      .then(() => {
        const node = figma.createText()

        // Add text box as a sibling of the selection.
        currentSelection.parent.appendChild(node)

        // Position text box directly atop selection.
        node.x = currentSelection.x
        node.y = currentSelection.y

        // Customize the appearance of the text box.
        setDefaultTextStyles(node, placeholderText, true)

        // Shift focus to the newly created text box.
        figma.currentPage.selection = [node]
      })
      .then(() => {
        figma.closePlugin()
        return
      })
  }
}

main()