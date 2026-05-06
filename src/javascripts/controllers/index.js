import { Application } from "@hotwired/stimulus"

if (!window.Stimulus) { window.Stimulus = Application.start() }
const application = window.Stimulus

import Clipboard from './clipboard_controller'
import ImagesViewerController from "./images_viewer_controller"
import LinkTargetController from "./link_target_controller"
import LoadMoreController from "./load_more_controller"
import NavTreeController from "./nav_tree_controller"
import ScrollToController from "./scroll_to_controller"
import TocController from "./toc_controller"
import AiSearchCompletionController from './ai_search_completion_controller'

application.register('clipboard', Clipboard)
application.register('images-viewer', ImagesViewerController)
application.register('link-target', LinkTargetController)
application.register('nav-tree', NavTreeController)
application.register('toc', TocController)
application.register("load-more", LoadMoreController)
application.register("scroll-to", ScrollToController)
application.register('ai-search-completion', AiSearchCompletionController)
