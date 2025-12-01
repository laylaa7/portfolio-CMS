"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type RichTextProps = {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
}

export default function RichText({ value = "", onChange, placeholder }: RichTextProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inserting, setInserting] = useState(false)

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value
    }
  }, [value])

  const exec = (cmd: string, arg?: string) => {
    // ensure the editable area is focused before running execCommand
    ref.current?.focus()
    try {
      document.execCommand(cmd, false, arg)
    } catch (err) {
      // some browsers may throw for deprecated commands; swallow
      console.warn('execCommand error', err)
    }
    if (onChange && ref.current) onChange(ref.current.innerHTML)
    // refocus editable area
    ref.current?.focus()
  }

  const isSelectionInsideList = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    let node: Node | null = sel.anchorNode
    while (node && node !== ref.current) {
      if (node instanceof Element && (node.tagName.toLowerCase() === 'ul' || node.tagName.toLowerCase() === 'ol')) {
        return node as HTMLElement
      }
      node = node.parentNode
    }
    return null
  }

  const toggleList = (type: 'ul' | 'ol') => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || !ref.current) return
    const range = sel.getRangeAt(0)

    // If the selection is within an existing list, unwrap it
    const listAncestor = isSelectionInsideList()
    if (listAncestor) {
      // unwrap: replace list with its li children content
      const parent = listAncestor.parentElement
      const frag = document.createDocumentFragment()
      Array.from(listAncestor.children).forEach((li) => {
        const wrapper = document.createElement('div')
        while (li.firstChild) wrapper.appendChild(li.firstChild)
        frag.appendChild(wrapper)
      })
      parent?.replaceChild(frag, listAncestor)
      if (onChange) onChange(ref.current.innerHTML)
      return
    }

    // Otherwise, wrap the selected content into a list
    const content = range.cloneContents()
    const nodes = Array.from(content.childNodes)
    if (nodes.length === 0) return

    const listEl = document.createElement(type === 'ul' ? 'ul' : 'ol')

    // Helper: create li from a node
    const makeLi = (node: Node) => {
      const li = document.createElement('li')
      li.appendChild(node.cloneNode(true))
      return li
    }

    // Group nodes: if node is a block (p, div, h*), make it its own li; otherwise collect inline nodes into a li
  let currentLi: HTMLElement = document.createElement('li')
    nodes.forEach((node) => {
      if (node.nodeType === 1 && (node as Element).matches && (node as Element).matches('div,p,section,article,h1,h2,h3')) {
        // flush currentLi
        if (currentLi && currentLi.childNodes.length) {
          listEl.appendChild(currentLi)
        }
        // add this node as its own li
        listEl.appendChild(makeLi(node))
        currentLi = document.createElement('li')
      } else {
        currentLi.appendChild(node.cloneNode(true))
      }
    })
  if (currentLi.childNodes.length) listEl.appendChild(currentLi)

    // Replace selection with list
    range.deleteContents()
    range.insertNode(listEl)
    if (onChange) onChange(ref.current.innerHTML)
    // move cursor after inserted list
    const after = document.createRange()
    after.setStartAfter(listEl)
    after.collapse(true)
    sel.removeAllRanges()
    sel.addRange(after)
  }

  const insertHTML = (html: string) => {
    ref.current?.focus()
    try {
      document.execCommand('insertHTML', false, html)
    } catch (err) {
      // fallback: insert at selection using Range
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        const frag = document.createRange().createContextualFragment(html)
        range.deleteContents()
        range.insertNode(frag)
      } else if (ref.current) {
        ref.current.innerHTML += html
      }
    }
    if (onChange && ref.current) onChange(ref.current.innerHTML)
    ref.current?.focus()
  }

  const clearFormattingOrSelection = () => {
    // If there's a selection inside the editor, replace the selection with its plain text
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && ref.current && ref.current.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0)
      const text = sel.toString()
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      // update change
      if (onChange) onChange(ref.current.innerHTML)
      return
    }

    // Otherwise, remove formatting across the whole editor but preserve text
    if (ref.current) {
      const text = ref.current.textContent || ''
      ref.current.innerHTML = text
      if (onChange) onChange(ref.current.innerHTML)
    }
  }

  const handleInsertIcon = async () => {
    // Simple flow: ask for a predefined shortcut or an image URL
    const choice = window.prompt('Insert icon: type "linkedin", "instagram", "facebook", "twitter", "email", "phone", "github" or paste an image URL (https://...)')
    if (!choice) return
    const c = choice.trim()
    // predefined emoji or small svg placeholders
    if (c === 'linkedin') {
      insertHTML('<a href="#" class="inline-flex items-center gap-2"><span class="sr-only">LinkedIn</span>🔗</a>&nbsp;')
      return
    }
    if (c === 'instagram') {
      insertHTML('<a href="#" class="inline-flex items-center gap-2"><span class="sr-only">Instagram</span>📸</a>&nbsp;')
      return
    }
    if (c === 'facebook') {
      insertHTML('<a href="#" class="inline-flex items-center gap-2"><span class="sr-only">Facebook</span>📘</a>&nbsp;')
      return
    }
    if (c === 'twitter') {
      insertHTML('<a href="#" class="inline-flex items-center gap-2"><span class="sr-only">Twitter</span>🐦</a>&nbsp;')
      return
    }
    if (c === 'email' || c === 'mail') {
      insertHTML('<a href="mailto:" class="inline-flex items-center gap-2"><span class="sr-only">Email</span>✉️</a>&nbsp;')
      return
    }
    if (c === 'phone') {
      insertHTML('<a href="tel:" class="inline-flex items-center gap-2"><span class="sr-only">Phone</span>📞</a>&nbsp;')
      return
    }
    if (c === 'github') {
      insertHTML('<a href="#" class="inline-flex items-center gap-2"><span class="sr-only">GitHub</span>🐙</a>&nbsp;')
      return
    }

    // If it looks like a URL, insert an <img>
    if (/^https?:\/\//i.test(c)) {
      const safe = c.replace(/"/g, '%22')
      insertHTML(`<img src="${safe}" alt="icon" class="inline-block h-4 w-4 align-text-bottom" />&nbsp;`)
      return
    }

    // Otherwise insert as text
    insertHTML(`<span>${c}</span>&nbsp;`)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <Button variant="ghost" size="sm" type="button" onClick={() => exec('bold')} aria-label="Bold">B</Button>
        <Button variant="ghost" size="sm" type="button" onClick={() => exec('italic')} aria-label="Italic">I</Button>
        <Button variant="ghost" size="sm" type="button" onClick={() => exec('underline')} aria-label="Underline">U</Button>
  <Button variant="ghost" size="sm" type="button" onClick={() => toggleList('ul')} aria-label="Bulleted list">• List</Button>
  <Button variant="ghost" size="sm" type="button" onClick={() => toggleList('ol')} aria-label="Numbered list">1. List</Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL (https://...)')
            if (url) exec('createLink', url)
          }}
          aria-label="Link"
        >
          🔗
        </Button>
        <Button variant="ghost" size="sm" type="button" onClick={handleInsertIcon} aria-label="Insert icon">Icon</Button>
        <Button variant="ghost" size="sm" type="button" onClick={() => { clearFormattingOrSelection() }} aria-label="Clear">Clear</Button>
      </div>
  <div className="text-xs text-muted-foreground">Tip: Place the cursor or select text inside the editor before using list or formatting buttons.</div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange && ref.current && onChange(ref.current.innerHTML)}
        className="min-h-[120px] p-3 border rounded prose max-w-none"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  )
}
