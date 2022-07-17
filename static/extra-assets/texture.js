jQuery(document).ready(function ($) {
    var viewer = WALK.getViewer();
    viewer.play();
    let scene;
    let optionsArray;
    let switchObjects = ["DecorativeObjects_Standard_Rooms"];
    var isFurnitureOff = false;
    let allDecorativeObjects = ["DecorativeObjects_Standard_Rooms"];

    var currentOptionObjects = "";

    fetch("cover.json")
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            scene = json;
        });
    fetch("options.json")
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            optionsArray = json;
        });

    // viewer.onNodeTypeClicked(function (node, position, distance) {
    //     console.log(node, position);
    // });

    WALK.getViewer().onSceneLoadComplete(function () {
        scene.extensions.filter((extension) => {
            if (extension.type === "SwitchObjects") {
                extension.nodeTypes.map((node) => {
                    var object = viewer.findNodesOfType(
                        "DecorativeObjects_" + node
                    );
                    if (object.length > 0) {
                        allDecorativeObjects.push("DecorativeObjects_" + node);
                        if (node.includes("Default")) {
                            switchObjects.push("DecorativeObjects_" + node);
                        }
                    }
                });
            }
        });
        console.log(allDecorativeObjects);
        data_html = "";
        optionsArray.forEach((option, index) => {
            data_html += `<section
                ref=${index}
                id=${option.name}
                class="group_change faqs_section section-padding bgf7f7f7"
            >
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="heading-title">${option.title}</div>
                            <div class="heading-title-bottom">
                                <span class="hr-space"></span>
                            </div>
                            <div class="row-item">`;
            let templateOptions = "";
            option.options.forEach((subOption) => {
                templateOptions += `
                    <div class="row second_heading">
                        <div class="col-md-12">
                            <p class="inner_heading">${subOption.title}</p>
                        </div>
                    </div>
                    <div class="row Product_selection no-gutters">
                        <div class="col-12">
                            <div class="color-item">
                                <img
                                    src="assets/thumbnail/${subOption.imageSrc}"
                                    class="config_view_item"
                                    data-item=${option.name}
                                    data-view=${subOption.name}
                                    crossorigin="anonymous"
                                />
                            </div>
                        <div class="center_text">${subOption.subtitle}</div>
                    </div>
                </div>`;
            });
            data_html += templateOptions;
            data_html += ` 
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;
        });
        // console.log(data_html);
        $("#option-list").html(data_html);
    });

    WALK.getViewer().onViewSwitchStarted(function (name) {
        if (name === "Display Furniture off") {
            isFurnitureOff = true;
        } else if (name === "Display Furniture on") {
            isFurnitureOff = false;
        }
    });

    $("#furniture-off").click(function () {
        if (!isFurnitureOff) {
            for (const node of allDecorativeObjects) {
                var object = viewer.findNodesOfType(node);
                object[0].hide();
                viewer.requestFrame();
            }
        } else {
            for (const node of switchObjects) {
                var object = viewer.findNodesOfType(node);
                if (object[0] !== undefined) {
                    object[0].show();
                }
                viewer.requestFrame();
            }
        }
        isFurnitureOff = !isFurnitureOff;
    });

    WALK.getViewer().onBeforeRender(function (name) {
        if (isFurnitureOff && currentOptionObjects) {
            var decorativeToRemove = viewer.findNodesOfType(
                "DecorativeObjects_" + currentOptionObjects
            );
            if (decorativeToRemove.length > 0) {
                decorativeToRemove[0].hide();
            }
        }
    });

    // WALK.getViewer().onViewSwitchDone(function (name) {
    //     // currentOptionObjects = null;
    // });

    function test1() {
        if (!$(".toogle_left").hasClass("minimum")) {
            console.log($("#ext-html-label-close"));
            $(".toogle_left").addClass("minimum");

            $(".gwd-div-110x").addClass("hidden");
            $(".container-options").addClass("hidden");
        } else {
            $(".toogle_left").removeClass("minimum");
            $(".gwd-div-110x").removeClass("hidden");
            $(".container-options").removeClass("hidden");
        }
    }
    $(".toogle_left").click(function () {
        if ($(this).hasClass("close")) {
            $(".toogle_left").removeClass("close");
        }
        test1();
    });
    $("body").on("DOMSubtreeModified", "#ext-html-label-content", function () {
        if ($(".toogle_left").hasClass("close")) {
            $(".toogle_left").removeClass("close");
        }

        var content = jQuery("#ext-html-label-content").html();
        if (content != "") {
            $(".group_change").removeClass("show");

            $(`#${content}`).addClass("show");
            // if (content == "Foyer_Door") {
            //     // 1
            //     $("#Foyer_Door").addClass("show");
            // } else if (content == "Floor") {
            //     // 2
            //     $("#Floor").addClass("show");
            // } else if (content == "Artwall") {
            //     // 3
            //     $("#Artwall").addClass("show");
            // } else if (content == "Kitchen") {
            //     // 4
            //     $("#Kitchen").addClass("show");
            // } else if (content == "Stove") {
            //     // 6
            //     $("#Stove").addClass("show");
            // } else if (content == "Oven") {
            //     // 7
            //     $("#Oven").addClass("show");
            // } else if (content == "Wardrobe") {
            //     // 9
            //     $("#Wardrobe").addClass("show");
            // } else if (content == "Bathroom_2") {
            //     //10
            //     $("#Bathroom_2").addClass("show");
            // } else if (content == "Bathroom_1") {
            //     //11
            //     $("#Bathroom_1").addClass("show");
            // } else if (content == "Kitchen_Pantry") {
            //     //12
            //     $("#Kitchen_Pantry").addClass("show");
            // } else if (content == "Dressroom") {
            //     //14
            //     $("#Dressroom").addClass("show");
            // } else if (content == "Powder_Drawer") {
            //     //15
            //     $("#Powder_Drawer").addClass("show");
            // } else if (content == "Bedroom2_3") {
            //     // 20
            //     $("#Bedroom2_3").addClass("show");
            // } else if (content == "Fridge") {
            //     // 18
            //     $("#Fridge").addClass("show");
            // }
        } else {
        }
        test1();

        if (content == "More Option") {
            $("#ext-html-label").hide();
        } else {
            $("#ext-html-label").show();
        }
    });

    $(document).on("click", ".config_view_item", function () {
        //
        var object_name = $(this).data("view");
        var object_item = $(this).data("item");
        currentOptionObjects = object_name;
        console.log(
            "🚀 ~ file: texture.js ~ line 274 ~ $ ~ object_name",
            object_name,
            "object_item",
            object_item,
            switchObjects
        );
        viewer.switchToView(object_item);

        switchObjects = switchObjects.filter(
            (object) => !object.includes(object_item)
        );
        switchObjects.push("DecorativeObjects_" + object_name);
        $(".config_view_item").each(function (i, obj) {
            //test
            var object_name_ = $(this).data("view");
            var object_item_ = $(this).data("item");

            if (object_item_ == object_item) {
                if (object_name_ == object_name) {
                    console.log(
                        "🚀 ~ file: texture.js ~ line 340 ~ $ ~ object_name_0",
                        object_name_
                    );

                    for (const node of viewer.findNodesOfType(object_name_)) {
                        node.show();
                        viewer.requestFrame();
                    }
                } else {
                    console.log(
                        "🚀 ~ file: texture.js ~ line 340 ~ $ ~ object_name_1",
                        object_name_
                    );
                    for (const node of viewer.findNodesOfType(object_name_)) {
                        node.hide();
                        viewer.requestFrame();
                    }
                }
            }
        });
    });
});
